export const DEV_SERVER_URL = "http://localhost:11000/api/";
export const PROD_SERVER_URL = "https://smart-farming.valentin-lelievre.com/api/";

export const SERVER_URL = !import.meta.dev ? PROD_SERVER_URL : DEV_SERVER_URL;

export const SOCKETIO_DEV_URL = "http://localhost:11010";
export const SOCKETIO_PROD_URL = "https://smart-farming.valentin-lelievre.com:11010";

export const SOCKETIO_URL = !import.meta.dev ? SOCKETIO_PROD_URL : SOCKETIO_DEV_URL;
