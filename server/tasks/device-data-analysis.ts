import mysql from 'mysql';

import { sqlRequestHandler } from '~/server/composables/api/database/sqlResquestHandler';

export default defineTask({
    meta: {
        name: "device-data-analysis",
    },

    async run({ payload, context }) {
        let params: any = payload.params;
        // @ts-ignore
        let dbPool = context.dbPool;

        // Get sensor infos
        let sql = mysql.format(`SELECT * FROM sensor WHERE id = ?`, [params.id]);
        let sensors = await sqlRequestHandler(dbPool, sql);

        // Check if sensor exists
        if(sensors.length == 0) return { result: "No sensors found" };

        // Get the name of the sensor
        let sensorName = sensors[0].name;
        
        // Call subfunction to analyze the data based on the sensor type
        if(sensorName.toLowerCase().includes("battery")) {
            return await batteryAdcAnalysis(params, dbPool);
        } else return { result: "No analysis required for this sensor" };
    },
});

async function batteryAdcAnalysis(params: any, dbPool: mysql.Pool) {
    const data: any = await useStorage('assets:server').getItem('battery_adc.csv');
    const lines = data.replaceAll("\r", "").split('\n').slice(1);
    lines.pop();

    let voltageToPercentage: any = {};
    for(const line of lines) {
        const [voltage, batteryLevel] = line.split(',');
        voltageToPercentage[voltage * 1] = parseFloat(batteryLevel);
    }

    let batteryPercentage = voltageToPercentage[params.value / params.division_f];

    // Store data in the database
    let query = `INSERT INTO measurements (value, value_string, sensor_id, unit_id) VALUES (${batteryPercentage}, '${batteryPercentage}', ${params.id}, ${4})`;
    await sqlRequestHandler(dbPool, query);

    return { result: "" };
}