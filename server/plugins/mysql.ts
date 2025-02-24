import mysql from 'mysql';

export default defineNitroPlugin((nitroApp) => {
    console.log("MySQL plugin loaded");

    // Get runtime configuration
    const config = useRuntimeConfig();
    console.log(config.ENV);

    // Get database configuration
    const DBconfig = useRuntimeConfig().DB;

    // Create pool connections for each database
    let DBs: InterfaceDB = {};
    for(let DBname of DBconfig.DB_NAME) {
        let dbPool: mysql.Pool = mysql.createPool({
            connectionLimit : DBconfig.DB_CONNECTION_LIMIT,
    
            waitForConnections: DBconfig.DB_WAIT_FOR_CONNECTIONS,
            queueLimit: DBconfig.DB_QUEUE_LIMIT,
    
            host: DBconfig.DB_HOST,
            database : DBname,

            port: 3306,
    
            user: DBconfig.DB_USER,
            password: DBconfig.DB_PASS,
    
            multipleStatements: DBconfig.DB_MULTIPLE_STATEMENTS,
        });

        DBs[DBname] = dbPool;
    }

    // Add DBs to the request context
    nitroApp.hooks.hook('request', (event) => { event.context.DBs = DBs; });
});

interface InterfaceDB {
    [key: string]: mysql.Pool
}