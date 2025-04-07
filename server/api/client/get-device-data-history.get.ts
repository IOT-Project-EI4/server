// import mysql from 'mysql';

// import { requestHandler } from '~/server/composables/api/apiRequests/requestsHandler';
// import { sqlRequestHandler } from '~/server/composables/api/database/sqlResquestHandler';

// import { Measurement } from '~/interfaces/database_types';

// export default defineEventHandler(async (event) => {
//     return await requestHandler({
//         event: event,
//         log: true,

//         name: "Smart farming - Get sensor data history",
//         dbName: "smart-farming",

//         queryParams: ["sensor_id", "unit_id", "from", "to", "mean_duration"],

//         handler: handler,
//     });
// });

// async function handler(event: any, dbPool: mysql.Pool, params: { [index: string]: any }) {
//     let fromDate = new Date(params.from * 1);
//     let toDate = new Date(params.to * 1);

//     // Get last 100 000 measurements for the sensor
//     let sql = mysql.format(`SELECT * FROM measurements WHERE sensor_id = ? AND unit_id = ? AND created_at >= ? AND created_at <= ? ORDER BY created_at DESC LIMIT 100000`, [params.sensor_id, params.unit_id, fromDate, toDate]);
//     let data : Measurement[] = await sqlRequestHandler(dbPool, sql);

//     // Do the mean of the values for each mean_duration
//     let meanData: Array<number> = [];

//     let lastDate = new Date();
//     let sum = 0; let count = 0;
//     let meanDuration = params.mean_duration * 60 * 1000; // Convert from minutes to milliseconds

//     for(let i = 0; i < data.length; i++) {
//         let date = new Date(data[i].created_at);

//         sum += data[i].value;
//         count ++;

//         if(date.getTime() + meanDuration < lastDate.getTime()) {
//             meanData.unshift(sum / count);

//             sum = 0; count = 0;
//             lastDate = date;
//         }
//     }

//     return { data: meanData };
// }

import mysql from 'mysql';

import { requestHandler } from '~/server/composables/api/apiRequests/requestsHandler';
import { sqlRequestHandler } from '~/server/composables/api/database/sqlResquestHandler';

export default defineEventHandler(async (event) => {
    return await requestHandler({
        event: event,
        log: true,

        name: "Smart farming - Get devices",
        dbName: "smart-farming",

        queryParams: ["device_id", "from", "to"],

        handler: handler,
    });
});

async function handler(event: any, dbPool: mysql.Pool, params: { [index: string]: any }) {
    // Get sensor infos
    let sql = mysql.format(`SELECT * FROM sensor WHERE device_id = ?`, [params.device_id]);
    let sensors = await sqlRequestHandler(dbPool, sql);

    // For each sensor get linked units
    for(let j = 0; j < sensors.length; j++) {
        // Get units linked to the sensor
        let sql = mysql.format(`SELECT * FROM measurement_units INNER JOIN unit_links ON measurement_units.id = unit_links.unit_id WHERE unit_links.sensor_id = ? AND unit_links.graph_type != "hidden"`, [sensors[j].id]);
        let units = await sqlRequestHandler(dbPool, sql);

        // For each unit get the last 1000 measurements
        for(let k = 0; k < units.length; k++) {
            let sql = mysql.format(`SELECT * FROM measurements WHERE sensor_id = ? AND unit_id = ? ORDER BY created_at DESC LIMIT 50000`, [sensors[j].id, units[k].unit_id]);
            let data = await sqlRequestHandler(dbPool, sql);

            // Filter measurements to keep only one per hour and do the mean of the values
            let filteredData: Array<any> = [];

            let lastDate = new Date();
            let sum = 0; let count = 0;

            for(let i = 0; i < data.length; i++) {
                let date = new Date(data[i].created_at);

                // If date is older than fromDate, skip it
                if(date.getTime() < params.from * 1) continue;

                // If date is newer than toDate, skip it
                if(date.getTime() > params.to * 1) continue;

                sum += data[i].value;
                count ++;

                if(date.getTime() + 60 * 1000 * 60 < lastDate.getTime()) { // 60 * 1000 * 60
                    filteredData.unshift({
                        created_at: lastDate,
                        value: sum / count,
                    });

                    sum = 0; count = 0;
                    lastDate = date;
                }
            }

            units[k].latestData = filteredData;
        }

        sensors[j].units = units;
    }

    return { sensors: sensors };
}