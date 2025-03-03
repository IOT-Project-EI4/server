import mysql from 'mysql';

import { requestHandler } from '~/server/composables/api/apiRequests/requestsHandler';
import { sqlRequestHandler } from '~/server/composables/api/database/sqlResquestHandler';

export default defineEventHandler(async (event) => {
    return await requestHandler({
        event: event,
        log: true,

        name: "Smart farming - TTN device data",
        dbName: "smart-farming",

        queryParams: [["uplink_message", "decoded_payload", "id"], ["uplink_message", "decoded_payload", "type"], ["uplink_message", "decoded_payload", "value"], ["uplink_message", "decoded_payload", "division_f"]],

        handler: handler,
    });
});

async function handler(event: any, dbPool: mysql.Pool, params: { [index: string]: any }) {
    console.log("Test device get data");
    console.log(params);

    // Insert the data into the database
    let query = `INSERT INTO measurements (value, value_string, sensor_id, unit_id) VALUES (${params["value"] / params["division_f"]}, '${params["value"]}', ${params["id"]}, ${params["type"]})`;
    await sqlRequestHandler(dbPool, query);

    console.log("Data inserted");

    // Run the data analysis task
    runTask("device-data-analysis", { payload: { params }, context: { dbPool } });

    console.log("Task ran");

    return "Success";
}