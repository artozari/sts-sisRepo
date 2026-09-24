"use strict";
/* v8 ignore next 352 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aedes_1 = __importDefault(require("aedes"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const path_1 = require("path");
const tls_1 = __importDefault(require("tls"));
const net_1 = require("net");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ws = require("websocket-stream");
/**
 * The `SecureServerClass` is a TypeScript class that implements a secure MQTT server using the Aedes MQTT broker library.
 */
class SecureServerClass {
    /**
     * This function initializes a MQTT broker using the configuration values provided.
     *
     * @param {ConfigClass} _CONFIG - The `_CONFIG` parameter is an instance of the `ConfigClass` class.
     * It is used to access the configuration values for the MQTT broker. It provides methods to retrieve configuration values based on keys.
     * @param {LogSystemClass} _LOGS - The `_LOGS` parameter is an instance of the `LogSystemClass` class, which is used for logging system events and messages.
     * It is likely used to log any relevant information or errors related to the MQTT broker.
     */
    constructor(_CONFIG, _LOGS) {
        this._CONFIG = _CONFIG;
        this._LOGS = _LOGS;
        this._httpServer = {};
        /**
         * The `start` method is a public method of the `SecureServerClass` class.
         * It is responsible for starting the MQTT server based on the value of the `_tls` property.
         * If `_tls` is `true`, it calls the `startTls` method, which starts the server with TLS encryption.
         * If `_tls` is `false`, it calls the `startWithoutTls` method, which starts the server without TLS encryption.
         */
        this.start = () => {
            if (this._tls === true)
                this.startTls();
            else
                this.startWithoutTls();
        };
        /**
         * The above code is implementing a TLS (Transport Layer Security) server using the Aedes MQTT broker library in TypeScript.
         * It sets up event handlers for clientDisconnect, clientReady, and keepaliveTimeout events.
         * It also authenticates MQTT clients using a username and password.
         * The TLS server is created using the tls module and listens on a specified port.
         * Additionally, an HTTP server is created to handle HTTP requests, and a WebSocket server is created to handle MQTT over WebSocket connections.
         */
        this.startTls = () => {
            // process the clientDisconnect event
            this._aedes.on("clientDisconnect", (client) => {
                // log the connection MQTT-WS
                const strMsg = `The MQTT client ${client.id} was disconnected.`;
                this._LOGS.publishWarn("MQTT client disconnected", strMsg, "");
            });
            // process the clientReady event
            this._aedes.on("clientReady", (client) => {
                // log the connection MQTT-WS
                const strMsg = `The MQTT client ${client.id} is ready.`;
                this._LOGS.publishWarn("MQTT client ready", strMsg, "");
            });
            // process the keepaliveTimeout event
            this._aedes.on("keepaliveTimeout", (client) => {
                // log the connection MQTT-WS
                const strMsg = `The MQTT client ${client.id} reached the keep alive timeout.`;
                this._LOGS.publishErrorEvent("MQTT keep alive timeout", strMsg, "");
            });
            //get the tsl files
            const serverKey = (0, path_1.join)(process.cwd(), "NotSign", "openssl", "server.key");
            // console.log('serverKey ->', serverKey);
            const serverCrt = (0, path_1.join)(process.cwd(), "NotSign", "openssl", "server.crt");
            // console.log('serverCrt ->', serverCrt);
            const options = {
                key: fs_1.default.readFileSync(serverKey),
                cert: fs_1.default.readFileSync(serverCrt),
            };
            // function to authenticate MQTT clients
            this._aedes.authenticate = (client, username, password, callback) => {
                let cb;
                let error = {};
                const passStr = password !== undefined ? password.toString() : "";
                let clientPrefixOk = !this._clientPrefix;
                if (this._clientPrefix) {
                    const clientPrefixStr = client.id.substring(0, 5);
                    if (clientPrefixStr === "slcn_")
                        clientPrefixOk = true;
                }
                console.log("_clientPrefix ->", this._clientPrefix);
                if ((clientPrefixOk && username == this._mqttUser && passStr == this._mqttPass) ||
                    this._mqttUser === undefined ||
                    this._mqttPass === undefined) {
                    // indicates that the connection is OK
                    cb = true;
                    error = null;
                }
                else {
                    // indicates that the connection has an error
                    cb = false;
                    error.message = "Auth error";
                    error.returnCode = 4;
                    // log the client connection error
                    const strError = `MQTT client <${client.id}> was rejected. The user and/or password are invalid.`;
                    this._LOGS.publishErrorEvent("MQTTS client connection error", strError, "");
                }
                // console.log(error, cb);
                callback(error, cb);
            };
            const requestListener = (req, res) => {
                const arrUrls = req.url.split("/");
                if (arrUrls[0] === "" && arrUrls[1] === "ping") {
                    // data to be sent
                    const data = {
                        status: 200,
                        statusMsg: "Success",
                        data: {
                            serverName: this._srvName,
                            serverVersion: this._srvVersion,
                            ts: new Date(),
                        },
                    };
                    const str = JSON.stringify(data);
                    // send the http response
                    res.writeHead(200);
                    res.end(str);
                }
            };
            const server = tls_1.default.createServer(options, this._aedes.handle);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this._httpServer = https_1.default.createServer(options, requestListener);
            // const ws = require('websocket-stream');
            ws.createServer({ server: this._httpServer }, this._aedes.handle);
            try {
                server.listen(this._port, () => {
                    // log the connection MQTT-WS
                    const strMsg = `Aedes MQTTS listening on port ${this._port} over TLS.`;
                    this._LOGS.publishWarn("MQTTS connection", strMsg, "");
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    // log the client connection error
                    const strError = error.message;
                    this._LOGS.publishErrorEvent("MQTTS connection error", strError, error.stack);
                }
            }
            // start the WS server
            try {
                this._httpServer.listen(this._portWs, () => {
                    // log the connection MQTT-WS
                    const strMsg = `Aedes MQTT-WS listening on port ${this._portWs} over TLS.`;
                    this._LOGS.publishWarn("MQTT-WS connection", strMsg, "");
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    // log the client connection error
                    const strError = error.message;
                    this._LOGS.publishErrorEvent("MQTT-WS connection error", strError, error.stack);
                }
            }
        };
        /**
         * The above code is implementing a server using the Aedes MQTT broker library in TypeScript.
         * It sets up event handlers for client disconnect, client ready, and keepalive timeout events.
         * It also defines an authentication function for MQTT clients.
         * The code creates an HTTP server and a WebSocket server to handle MQTT over WebSocket connections.
         * Finally, it starts the server and listens for incoming connections on the specified ports.
         */
        this.startWithoutTls = () => {
            // process the clientDisconnect event
            this._aedes.on("clientDisconnect", (client) => {
                // log the connection MQTT-WS
                const strMsg = `The MQTT client ${client.id} was disconnected.`;
                this._LOGS.publishWarn("MQTT client disconnected", strMsg, "");
            });
            // process the clientReady event
            this._aedes.on("clientReady", (client) => {
                // log the connection MQTT-WS
                const strMsg = `The MQTT client ${client.id} is ready.`;
                this._LOGS.publishWarn("MQTT client ready", strMsg, "");
            });
            // process the keepaliveTimeout event
            this._aedes.on("keepaliveTimeout", (client) => {
                // log the connection MQTT-WS
                const strMsg = `The MQTT client ${client.id} reached the keep alive timeout.`;
                this._LOGS.publishErrorEvent("MQTT keep alive timeout", strMsg, "");
            });
            // function to authenticate MQTT clients
            this._aedes.authenticate = (client, username, password, callback) => {
                let cb;
                let error = {};
                const passStr = password !== undefined ? password.toString() : null;
                // console.log(username, passStr);
                if ((username == this._mqttUser && passStr == this._mqttPass) || this._mqttUser === undefined || this._mqttPass === undefined) {
                    // indicates that the connection is OK
                    cb = true;
                    error = null;
                }
                else {
                    // indicates that the connection has an error
                    cb = false;
                    error.message = "Auth error";
                    error.returnCode = 4;
                    // log the client connection error
                    const strError = `MQTT client <${client.id}> was rejected. The user and/or password are invalid.`;
                    this._LOGS.publishErrorEvent("MQTTS client connection error", strError, "");
                }
                // console.log(error, cb);
                callback(error, cb);
            };
            const requestListener = (req, res) => {
                const arrUrls = req.url.split("/");
                if (arrUrls[0] === "" && arrUrls[1] === "ping") {
                    // data to be sent
                    const data = {
                        status: 200,
                        statusMsg: "Success",
                        data: {
                            serverName: this._srvName,
                            serverVersion: this._srvVersion,
                            ts: new Date(),
                        },
                    };
                    const str = JSON.stringify(data);
                    // send the http response
                    res.writeHead(200);
                    res.end(str);
                }
            };
            const server = (0, net_1.createServer)(this._aedes.handle);
            try {
                server.listen(this._port, () => {
                    // console.log('server started and listening on port ', this._port)
                    const strMsg = `Aedes MQTTS listening on port: ${this._port}.`;
                    this._LOGS.publishWarn("MQTTS connection", strMsg, "");
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    // log the client connection error
                    const strError = error.message;
                    this._LOGS.publishErrorEvent("MQTTS connection error", strError, error.stack);
                }
            }
            try {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const httpServer = require("http").createServer(requestListener);
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const ws = require("websocket-stream");
                ws.createServer({ server: httpServer }, this._aedes.handle);
                httpServer.listen(this._portWs, () => {
                    // log the connection MQTT-WS
                    const strMsg = `Aedes MQTT-WS listening on port: ${this._portWs}.`;
                    this._LOGS.publishWarn("MQTT-WS connection", strMsg, "");
                });
            }
            catch (error) {
                // log the client connection error
                if (error instanceof Error) {
                    const strError = error.message;
                    this._LOGS.publishErrorEvent("MQTT-WS connection error", strError, error.stack);
                }
            }
        };
        // initializes the broker MQTT
        this._aedes = new aedes_1.default();
        // gets the env PORT
        let envPort;
        try {
            envPort = process.env.PORT ? parseInt(process.env.PORT) : undefined;
        }
        catch (error) {
            envPort = undefined;
        }
        // gets the configuration
        this._port = this._CONFIG.getNumber(["AEDES", "port"]) ?? 1883;
        this._portWs = envPort ?? this._CONFIG.getNumber(["AEDES", "portWs"]) ?? 8883;
        this._tls = this._CONFIG.getBoolean(["AEDES", "tls"]) ?? true;
        this._clientPrefix = this._CONFIG.getBoolean(["AEDES", "clientPrefix"]) ?? true;
        this._mqttUser = this._CONFIG.get(["AEDES", "username"]) ?? undefined;
        this._mqttPass = this._CONFIG.get(["AEDES", "password"]) ?? undefined;
        this._srvName = this._CONFIG.get(["APP", "SRV_NAME"]);
        this._srvVersion = this._CONFIG.get(["APP", "SRV_VER"]);
    }
}
exports.default = SecureServerClass;
