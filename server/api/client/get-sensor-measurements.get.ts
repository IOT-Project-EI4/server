import mysql from 'mysql';

import { requestHandler } from '~/server/composables/api/apiRequests/requestsHandler';
import { sqlRequestHandler } from '~/server/composables/api/database/sqlResquestHandler';

export default defineEventHandler(async (event) => {
    return await requestHandler({
        event: event,
        log: true,

        name: "Smart farming - Get devices",
        dbName: "smart-farming",

        queryParams: ["sensor_id"],

        handler: handler,
    });
});

async function handler(event: any, dbPool: mysql.Pool, params: { [index: string]: any }) {
    // Get sensor infos
    let sql = mysql.format(`SELECT * FROM sensor WHERE id = ?`, [params.sensor_id]);
    let sensors = await sqlRequestHandler(dbPool, sql);

    let sensor;
    // Check if sensor exists
    if(sensors.length === 0) return { error: "Sensor not found" };
    else sensor = sensors[0];

    // Get units linked to the sensor
    sql = mysql.format(`SELECT * FROM measurement_units INNER JOIN unit_links ON measurement_units.id = unit_links.unit_id WHERE unit_links.sensor_id = ?`, [sensor.id]);
    let units = await sqlRequestHandler(dbPool, sql);

    // For each unit get the last 1000 measurements
    for(let k = 0; k < units.length; k++) {
        sql = mysql.format(`SELECT * FROM measurements WHERE sensor_id = ? AND unit_id = ? ORDER BY created_at DESC LIMIT 1000`, [sensor.id, units[k].id]);
        let data = await sqlRequestHandler(dbPool, sql);

        // Filter measurements to keep only one per minute
        let filteredData: Array<any> = [];

        let lastDate = new Date();
        for(let i = 0; i < data.length; i++) {
            let date = new Date(data[i].created_at);

            if(i == 0 || date.getTime() + 60 * 1000 < lastDate.getTime()) {
                filteredData.unshift(data[i]);
                lastDate = date;
            }
        }

        units[k].latestData = data;
    }

    sensor.units = units;
    return { sensorData: sensor };
}