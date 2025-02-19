
export async function requestHandler(handlerConfig: requestHandlerConfig) {
    const config = useRuntimeConfig();

    // Get the database pool and select the database
    let dbPool = handlerConfig.event.context.DBs[handlerConfig.dbName];
    if(!dbPool) {
        if(config.ENV == "DEV" && handlerConfig.log) console.log("DB pool not found");

        setResponseStatus(handlerConfig.event, 500);
        return "";
    }

    let method = handlerConfig.event._method;

    // Get the query parameters, store each param in object
    let query;
    if(method == "GET") query = getQuery(handlerConfig.event);
    else if(method == "POST") query = await readBody(handlerConfig.event);
    else {
        setResponseStatus(handlerConfig.event, 405);
        return "";
    }

    let params: { [index: string]: any } = {};

    // Check if the parameters are valid
    for(let param of handlerConfig.queryParams) {
        if(!query[param]) {
            setResponseStatus(handlerConfig.event, 400);
            return "Missing parameters";
        } else params[param] = query[param];
    }

    // If dev mode, log the request and print each parameter
    if(config.ENV == "DEV" && handlerConfig.log) {
        console.log(handlerConfig.name);
        for(let param of handlerConfig.queryParams) console.log(`${param}: ${query[param]}`);
    }

    // Call the handler
    let response = await handlerConfig.handler(handlerConfig.event, dbPool, params);

    // Format the response
    response = typeof response == "string" ? response : JSON.stringify(response);

    setResponseStatus(handlerConfig.event, 200);
    return response;
}

interface requestHandlerConfig {
    event: any;
    log: boolean;

    name: string;
    dbName: string;

    queryParams: Array<string>;

    handler: Function;
}