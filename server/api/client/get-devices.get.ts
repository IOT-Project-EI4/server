import mysql from 'mysql';

import { requestHandler } from '~/server/composables/api/apiRequests/requestsHandler';
import { sqlRequestHandler } from '~/server/composables/api/database/sqlResquestHandler';

export default defineEventHandler(async (event) => {
    return await requestHandler({
        event: event,
        log: true,

        name: "Smart farming - Get devices",
        dbName: "smart-farming",

        queryParams: ["greenhouse_id"],

        handler: handler,
    });
});

async function handler(event: any, dbPool: mysql.Pool, params: { [index: string]: any }) {
    // Get devices

    // SELECT * FROM devices WHERE house_id = ? AND approved = 1
    let sql = mysql.format(`SELECT * FROM device WHERE device_group_id = ?`, [params.greenhouse_id]);
    let devices = await sqlRequestHandler(dbPool, sql);

    // For each devices get sensors list
    for(let i = 0; i < devices.length; i++) {
        sql = mysql.format(`SELECT * FROM sensor WHERE device_id = ? ORDER BY id DESC`, [devices[i].id]);
        let sensors = await sqlRequestHandler(dbPool, sql);

        // For each sensor get linked units
        for(let j = 0; j < sensors.length; j++) {
            sql = mysql.format(`SELECT * FROM measurement_units INNER JOIN unit_links ON measurement_units.id = unit_links.unit_id WHERE unit_links.sensor_id = ?`, [sensors[j].id]);
            let units = await sqlRequestHandler(dbPool, sql);

            // For each unit get the latest data
            for(let k = 0; k < units.length; k++) {
                sql = mysql.format(`SELECT * FROM measurements WHERE sensor_id = ? AND unit_id ORDER BY created_at DESC LIMIT 1`, [sensors[j].id, units[k].id]);
                let data = await sqlRequestHandler(dbPool, sql);

                units[k].latestData = data[0];
            }

            sensors[j].units = units;
        }

        devices[i].sensors = sensors;
    }

    return { devices: devices };
}