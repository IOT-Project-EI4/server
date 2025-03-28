
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
        if(config.ENV == "DEV" && handlerConfig.log) console.log("Method not allowed");

        setResponseStatus(handlerConfig.event, 405);
        return "";
    }

    let params: { [index: string]: any } = {};

    // Check if the parameters are valid
    for(let param of handlerConfig.queryParams) {
        // Check if the parameter is an array
        if(Array.isArray(param)) {
            let ref = query;

            // @ts-ignore
            for(let p of param) {
                if(!ref[p]) return missingParam(handlerConfig, p); // Missing parameter
                else ref = ref[p];
            }

            params[param[param.length - 1]] = ref;
        } else {
            if(!query[param]) return missingParam(handlerConfig, param); // Missing parameter
            else params[param] = query[param];
        }
    }

    // If dev mode, log the request and print each parameter
    if(config.ENV == "DEV" && handlerConfig.log) {
        console.log(handlerConfig.name);
        for(let [key, value] of Object.entries(params)) console.log(`${key}: ${value}`);
    }

    // Call the handler
    let response = await handlerConfig.handler(handlerConfig.event, dbPool, params);

    // Format the response
    response = typeof response == "string" ? response : JSON.stringify(response);

    setResponseStatus(handlerConfig.event, 200);
    return response;
}

function missingParam(handlerConfig: requestHandlerConfig, param: string) {
    if(useRuntimeConfig().ENV == "DEV" && handlerConfig.log) console.log(`Missing parameter: ${param}`);

    setResponseStatus(handlerConfig.event, 400);
    return "Missing parameters";
}

interface requestHandlerConfig {
    event: any;
    log: boolean;

    name: string;
    dbName: string;

    queryParams: Array<string> | Array<Array<string>>;

    handler: Function;
}