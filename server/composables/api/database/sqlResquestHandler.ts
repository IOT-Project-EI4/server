export async function sqlRequestHandler(dbPool: any, sql: string): Promise<any> {
    return new Promise((resolve, reject) => {
        dbPool.query(sql, (err: any, result: any) => {
            if(err) {
                if(useRuntimeConfig().ENV == "DEV") console.log(err);
                return reject([]);
            }
            
            resolve(result);
        });
    });

}