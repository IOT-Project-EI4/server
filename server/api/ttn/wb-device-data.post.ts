import mysql from 'mysql';

import { requestHandler } from '~/server/composables/api/apiRequests/requestsHandler';
import { sqlRequestHandler } from '~/server/composables/api/database/sqlResquestHandler';

export default defineEventHandler(async (event) => {
    return await requestHandler({
        event: event,
        log: true,

        name: "Smart farming - TTN device data",
        dbName: "smart-farming",

        queryParams: [["uplink_message", "decoded_payload", "bytes"]],

        handler: handler,
    });
});

async function handler(event: any, dbPool: mysql.Pool, params: { [index: string]: any }) {
    console.log("Test device get data");
    console.log(params);

    // Decode and reformat bytes
    // Create array of { id, type, value, division_f } from params["uplink_message"]["decoded_payload"]["bytes"]
    // Bytes is array of number

    let bytes = params.bytes;
    let measurements: Array<{ id: number, type: number, value: number, division_f: number }> = [
        {
            id: 2,
            type: 5,
            value: (bytes[0] << 8) + bytes[1],
            division_f: 50,
        },

        {
            id: 9,
            type: 8,
            value: bytes[2],
            division_f: 1,
        },

        {
            id: 9,
            type: 9,
            value: bytes[3],
            division_f: 1,
        },

        {
            id: 9,
            type: 10,
            value: bytes[4],
            division_f: 1,
        },

        {
            id: 9,
            type: 17,
            value: (bytes[5] << 8) + bytes[6],
            division_f: 1,
        },

        {
            id: 8,
            type: 15,
            value: (bytes[7] << 8) + bytes[8],
            division_f: 1,
        },

        {
            id: 8,
            type: 1,
            value: (bytes[9] << 8) + bytes[10],
            division_f: 10,
        },

        {
            id: 8,
            type: 2,
            value: bytes[11],
            division_f: 1,
        },

        {
            id: 5,
            type: 13,
            value: bytes[12],
            division_f: 1,
        },

        {
            id: 5,
            type: 14,
            value: bytes[13],
            division_f: 1,
        },

        {
            id: 6,
            type: 11,
            value: (bytes[14] << 8) + bytes[15],
            division_f: 10,
        },

        {
            id: 6,
            type: 12,
            value: (bytes[16] << 8) + bytes[17],
            division_f: 10,
        },

        {
            id: 10,
            type: 16,
            value: (bytes[18] << 8) + bytes[19],
            division_f: 1,
        },
    ];

    for(let i = 0; i < measurements.length; i++) {
        let params = measurements[i];

        // Insert the data into the database
        let query = `INSERT INTO measurements (value, value_string, sensor_id, unit_id) VALUES (${params["value"] / params["division_f"]}, '${params["value"]}', ${params["id"]}, ${params["type"]})`;
        await sqlRequestHandler(dbPool, query);

        console.log("Data inserted");

        // Run the data analysis task
        runTask("device-data-analysis", { payload: { params }, context: { dbPool } });

        console.log("Task ran");
    }

    return "Success";
}