import mysql from 'mysql';

import { requestHandler } from '~/server/composables/api/apiRequests/requestsHandler';
import { sqlRequestHandler } from '~/server/composables/api/database/sqlResquestHandler';

import type { Greenhouse, DeviceGroup, Device, Sensor, Unit } from '~/interfaces/database_types';

export default defineEventHandler(async (event) => {
    return await requestHandler({
        event: event,
        log: false,

        name: "Smart farming - Get devices",
        dbName: "smart-farming",

        queryParams: ["greenhouse_id"],

        handler: handler,
    });
});

async function handler(event: any, dbPool: mysql.Pool, params: { [index: string]: any }) {
    // Get green_house infos
    let sql = mysql.format(`SELECT * FROM greenhouse WHERE id = ?`, [params.greenhouse_id]);
    let greenhouseList: Greenhouse[] = await sqlRequestHandler(dbPool, sql);

    // Check if greenhouse exists
    if(greenhouseList.length < 1) return { greenhouse: undefined }; // Greenhouse not found
    let greenhouse: Greenhouse = greenhouseList[0] as Greenhouse;

    // Select all device groups from params.greenhouse_id
    sql = mysql.format(`SELECT * FROM device_group WHERE greenhouse_id = ?`, [params.greenhouse_id]);
    let deviceGroups: DeviceGroup[] = await sqlRequestHandler(dbPool, sql) as DeviceGroup[]; // Get all device groups from the greenhouse

    // For each device group get devices list
    for(let i = 0; i < deviceGroups.length; i++) {
        sql = mysql.format(`SELECT * FROM device WHERE device_group_id = ?`, [deviceGroups[i].id]);
        let groupDevices: Device[] = await sqlRequestHandler(dbPool, sql) as Device[]; // Get all devices from the device group

        // For each device get sensors list
        for(let j = 0; j < groupDevices.length; j++) {
            sql = mysql.format(`SELECT * FROM sensor WHERE device_id = ? ORDER BY id DESC`, [groupDevices[j].id]);
            let sensors: Sensor[] = await sqlRequestHandler(dbPool, sql) as Sensor[]; // Get all sensors from the device

            // For each sensor get linked units
            for(let k = 0; k < sensors.length; k++) {
                sql = mysql.format(`SELECT * FROM measurement_units INNER JOIN unit_links ON measurement_units.id = unit_links.unit_id WHERE unit_links.sensor_id = ?`, [sensors[k].id]);
                let units: Unit[] = await sqlRequestHandler(dbPool, sql) as Unit[]; // Get all units linked to the sensor

                // For each unit get the latest data
                for(let l = 0; l < units.length; l++) {
                    sql = mysql.format(`SELECT * FROM measurements WHERE sensor_id = ? AND unit_id = ? ORDER BY created_at DESC LIMIT 1`, [sensors[k].id, units[l].unit_id]);
                    let data = await sqlRequestHandler(dbPool, sql);

                    if(data.length >= 1) units[l].latestData = data[0];
                    else units[l].latestData = undefined; // No data available for this unit
                }

                sensors[k].units = units;
            }

            groupDevices[j].sensors = sensors;
        }

        deviceGroups[i].devices = groupDevices;
    }

    greenhouse.devices_groups = deviceGroups;
    return { greenhouse: greenhouse }; // Return the greenhouse with all devices and sensors
}