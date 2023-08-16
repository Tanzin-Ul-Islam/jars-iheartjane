import serverConfig from "./server.json"

export const server = pointServer();

function pointServer() {
    if (typeof window !== 'undefined') {
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            return serverConfig.staging.STAGING_SERVER_HOST;
        }
        else {
            return serverConfig.server_prod.SERVER_HOST;
        }
    }
}
