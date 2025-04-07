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
        { // ADC
            id: 2,
            type: 5,
            value: (bytes[0] << 8) + bytes[1],
            division_f: 100,
        },

        { // R
            id: 9,
            type: 8,
            value: bytes[2],
            division_f: 1,
        },

        { // G
            id: 9,
            type: 9,
            value: bytes[3],
            division_f: 1,
        },

        { // B
            id: 9,
            type: 10,
            value: bytes[4],
            division_f: 1,
        },

        { // Light color
            id: 9,
            type: 17,
            value: (bytes[5] << 8) + bytes[6],
            division_f: 1,
        },

        { // CO2
            id: 8,
            type: 15,
            value: (bytes[7] << 8) + bytes[8],
            division_f: 1,
        },

        { // Ext temp
            id: 8,
            type: 1,
            value: (bytes[9] << 8) + bytes[10],
            division_f: 10,
        },

        { // Ext humidity
            id: 8,
            type: 2,
            value: bytes[11],
            division_f: 1,
        },

        { // Ground humidity 1
            id: 5,
            type: 13,
            value: bytes[12],
            division_f: 1,
        },

        { // Ground humidity 2
            id: 5,
            type: 14,
            value: bytes[13],
            division_f: 1,
        },

        { // Ground temperature 1
            id: 6,
            type: 11,
            value: (bytes[14] << 8) + bytes[15],
            division_f: 10,
        },

        { // Ground temperature 2
            id: 6,
            type: 12,
            value: (bytes[16] << 8) + bytes[17],
            division_f: 10,
        },

        { // Lux
            id: 10,
            type: 16,
            value: (bytes[18] << 8) + bytes[19],
            division_f: 1,
        },

        { // Light color 2
            id: 9,
            type: 18,
            value: 0,
            division_f: 1,
        },
    ];

    let r = measurements[1].value;
    let g = measurements[2].value;
    let b = measurements[3].value;

    // Overide lux data readings by calculating it from r,g,b values
    let lux = (-0.32466 * r) + (1.57837 * g) + (-0.73191 * b);
    lux *= 250;
    lux = Math.round(lux);

    lux = Math.max(0, lux); // Lux can't be negative
    lux = Math.min(65535, lux); // Lux can't be more than 65535

    measurements[12].value = lux;

    // The light color calculation is also wrong, new light color value using adafruit formula
    if(r != 0 || g != 0 || b != 0) {
        let x = (-0.14282 * r) + (1.54924 * g) + (-0.95641 * b);
        let y = (-0.32466 * r) + (1.57837 * g) + (-0.73191 * b);
        let z = (-0.68202 * r) + (0.77073 * g) + (0.56332 * b);

        let xc = x / (x + y + z);
        let yc = y / (x + y + z);

        let n = (xc - 0.3320) / (0.1858 - yc);
        let cct = 449 * Math.pow(n, 3) + 3525 * Math.pow(n, 2) + 6823.3 * n + 5520.33;

        cct = Math.round(cct);

        cct = Math.max(0, cct); // CCT can't be negative
        cct = Math.min(65000, cct); // CCT can't be more than 65535

        measurements[13].value = cct;
    } else {
        measurements[13].value = 0; // If r,g,b are 0, set cct to 0
    }

    // Increment the battery voltage value by 0.18V
    measurements[0].value += (0.18 + 0.5) * measurements[0].division_f;
    measurements[0].value = Math.round(measurements[0].value * 100) / 100;

    // Divide CO2 valueby 3
    measurements[5].value /= 3;
    measurements[5].value = Math.round(measurements[5].value); // Round to 0 decimal places

    for(let i = 0; i < measurements.length; i++) {
        let params = measurements[i];

        // Insert the data into the database
        let query = `INSERT INTO measurements (value, value_string, sensor_id, unit_id) VALUES (${params["value"] / params["division_f"]}, '${params["value"]}', ${params["id"]}, ${params["type"]})`;
        await sqlRequestHandler(dbPool, query);

        if(i == 0) {
            params.value -= (0.08 + 0.5) * params.division_f; // 0.45 : fake offset for testing
            params.value = Math.round(params.value * 100) / 100; // Round to 2 decimal places
        }

        // Run the data analysis task
        runTask("device-data-analysis", { payload: { params }, context: { dbPool } });

        console.log("Task ran");
    }

    return "Success";
}