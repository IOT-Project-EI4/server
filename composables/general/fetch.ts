import { SERVER_URL } from '~/constants/server';

export async function cfetch(config: FetchConfig) {
    await $fetch(SERVER_URL + config.url, {
        method: config.method || "GET",
        
        query: config.query,
        body: config.body,

        server: false,

        onResponse({ request, response, options }) {
            config.handler(JSON.parse(response._data));
        },

        onResponseError({ request, response, options }) {
            config.handler("error");
        }
    });
}

interface FetchConfig {
    url: string;
    method?: "GET" | "POST";

    query?: { [index: string]: any };
    body?: string,

    handler: Function;
}