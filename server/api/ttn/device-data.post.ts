import mysql from 'mysql';

import { requestHandler } from '~/server/composables/api/apiRequests/requestsHandler';
import { sqlRequestHandler } from '~/server/composables/api/database/sqlResquestHandler';

export default defineEventHandler(async (event) => {
    console.log(await readBody(event));

    return await requestHandler({
        event: event,
        log: false,

        name: "Smart farming - TTN device data",
        dbName: "smart-farming",

        queryParams: [["uplink_message", "decoded_payload", "id"], ["uplink_message", "decoded_payload", "type"], ["uplink_message", "decoded_payload", "value"]],

        handler: handler,
    });
});

async function handler(event: any, dbPool: mysql.Pool, params: { [index: string]: any }) {
    // Log the data
    console.log("Test route called");
    console.log(params)

    return "Succes";
}