"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressAppClass = void 0;
// import dotenv from 'dotenv';
const cors_1 = __importDefault(require("cors"));
const express_1 = __importStar(require("express"));
const node_http_1 = __importDefault(require("node:http"));
const node_https_1 = __importDefault(require("node:https"));
const morgan_1 = __importDefault(require("morgan"));
const node_path_1 = __importDefault(require("node:path"));
const rfs = __importStar(require("rotating-file-stream"));
const datetime_class_1 = require("datetime-class");
const http_response_class_1 = require("http-response-class");
const morgan_class_1 = __importDefault(require("./morgan/morgan.class"));
const openssl_1 = __importDefault(require("./openssl/openssl"));
const utility_libraries_1 = require("utility-libraries");
// export * from './morgan';
// dotenv.config();
class ExpressAppClass {
    constructor(_CONFIG, _LOGS) {
        this._CONFIG = _CONFIG;
        this._LOGS = _LOGS;
        this.routesApp = (0, express_1.Router)();
        this._openSsl = new openssl_1.default();
        this._portHttp = undefined;
        this._portHttps = undefined;
        this._bActiveSsl = false;
        this.setupUrls = () => {
            // The code block `this._app.get('/ping', (req: Request, res: Response) => { ... })` is defining a route for the HTTP GET request to the '/ping' endpoint.
            this._app.get("/ping", (req, res) => {
                const dt = new datetime_class_1.DatetimeClass();
                const dataTx = {
                    serverName: this._CONFIG.get(["APP", "SRV_NAME"]),
                    timestamp: dt.utc_toISO(),
                };
                return this.httpResponseClass.OK(res, dataTx);
            });
            // The code block `this._app.get('/ping', (req: Request, res: Response) => { ... })` is defining a route for the HTTP GET request to the '/ping-full' endpoint.
            this._app.get("/ping-full", (req, res) => {
                const dt = new datetime_class_1.DatetimeClass();
                const dataOpenSSL = {
                    notBefore: this._openSsl.notBefore(),
                    notAfter: this._openSsl.notAfter(),
                    daysOfExpiration: this._openSsl.daysOfExpiration(),
                    organizationName: this._openSsl.attribute("organizationName"),
                    emailAddress: this._openSsl.attribute("emailAddress"),
                };
                const dataTx = {
                    serverName: this._CONFIG.get(["APP", "SRV_NAME"]),
                    serverVersion: this._CONFIG.get(["APP", "SRV_VER"]),
                    serverID: this._CONFIG.getServiceId(false),
                    serverID_full: this._CONFIG.getServiceId(true),
                    timestamp: dt.utc_toISO(),
                    dataOpenSSL,
                };
                return this.httpResponseClass.OK(res, dataTx);
            });
        };
        this.checkingSslCertificate = () => {
            if (this._openSsl.verify()) {
                this._portHttps = this._CONFIG.getNumber(["HTTP", "PORTS"]);
                if (this.checkPortHttp(this._portHttps)) {
                    this._bActiveSsl = true;
                }
            }
        };
        this.listen = () => {
            try {
                // The line `this.openSsl.load();` is calling the `load()` method of the `OpenSslClass` instance `openSsl`.
                // This method is responsible for loading the SSL certificate and key required for setting up an HTTPS server.
                this._openSsl.load();
                // The code block is initializing variables used for logging purposes.
                const metadata = "";
                const name = "ExpressApp";
                const appName = this._CONFIG.get(["APP", "SRV_NAME"]);
                // The code block is checking if the SSL certificate is verified and a valid HTTPS port is provided in the configuration.
                this.checkingSslCertificate();
                // The code block is defining a route for the HTTP GET request to the '/ping' and '/ping-full' endpoints.
                this.setupUrls();
                // This code block is responsible for creating an HTTP server and listening on the specified port.
                // It first retrieves the HTTP port number from the configuration using _CONFIG.getNumber(['HTTP', 'PORT'])`.
                // Then, it creates an HTTP server using `http.createServer(this._app)`, where `this._app` is the Express application.
                this._portHttp = this._CONFIG.getNumber(["HTTP", "PORT"]);
                const httpServer = node_http_1.default.createServer(this._app);
                // The above code is checking if the specified port for HTTP is available for use.
                if (this.checkPortHttp(this._portHttp)) {
                    // The code block is creating an HTTP server and listening on the specified port (`this._portHttp`).
                    httpServer
                        .listen(this._portHttp, () => {
                        console.log(`Server HTTP on port: ${this._portHttp}`);
                    })
                        .on("error", () => {
                        const msg = `"${appName}" could not connect on http://localhost:${this._portHttp}`;
                        //console.log(msg);
                        (0, utility_libraries_1.processExitFunction)(msg);
                        if (this._LOGS)
                            this._LOGS.publishEvent(name, msg, metadata);
                    });
                }
                else {
                    // This code block is responsible for logging an event message when there is no HTTP port specified in the configuration.
                    // It creates a string message `msg` indicating that there is no HTTP port in the specified application name (`""`).
                    // Then, it calls the `publishEvent` method of the `_LOGS` instance to publish the event with the provided name, message, and metadata.
                    const msg = `There is no HTTP port in "${appName}"`;
                    if (this._LOGS)
                        this._LOGS.publishEvent(name, msg, metadata);
                }
                // The above code is creating an HTTPS server using the `https` module in Node.js.
                // It is using the `createServer` method to create the server and passing in two arguments: `credentials` and `this._app`.
                const credentials = {
                    key: this._openSsl.getKey(),
                    cert: this._openSsl.getCert(),
                };
                const httpsServer = node_https_1.default.createServer(credentials, this._app);
                // The above code is checking if the specified port for HTTPS is available for use.
                if (this.checkPortHttp(this._portHttps)) {
                    httpsServer
                        .listen(this._portHttps, () => {
                        console.log(`Server HTTPS on port: ${this._portHttps}`);
                    })
                        .on("error", () => {
                        const msg = `"${appName}" could not connect on https://localhost:${this._portHttps}`;
                        // console.log(msg);
                        (0, utility_libraries_1.processExitFunction)(msg);
                        if (this._LOGS)
                            this._LOGS.publishEvent(name, msg, metadata);
                    });
                }
                else {
                    // This code block is responsible for logging an event message when there is no HTTPS port specified in the configuration.
                    // It creates a string message `msg` indicating that there is no HTTPS port in the specified application name (`""`).
                    // Then, it calls the `publishEvent` method of the `_LOGS` instance to publish the event with the provided name, message, and metadata.
                    const msg = `There is no HTTPS port in "${appName}"`;
                    if (this._LOGS)
                        this._LOGS.publishEvent(name, msg, metadata);
                }
            }
            catch (e) {
                console.log(e.message);
                if (this._LOGS) {
                    if (e instanceof Error)
                        this._LOGS.publishError(e);
                }
            }
        };
        this.httpResponseClass = new http_response_class_1.HttpResponseClass();
        this._app = (0, express_1.default)();
        this.middelware();
    }
    /**
     * The `middelware` function sets up middleware for the Express app, including redirecting HTTP to
     * HTTPS, handling CORS, logging HTTP requests, and parsing JSON.
     * @returns The middleware function does not return anything. It is a void function.
     */
    middelware() {
        // The code block is setting up CORS (Cross-Origin Resource Sharing) middleware in an Express application.
        // CORS is a mechanism that allows resources (e.g., fonts, JavaScript, etc.)
        // on a web page to be requested from another domain outside the domain from which the resource originated.
        const whitelist = this._CONFIG.getArray(["CORS"]);
        const corsOptions = {
            // eslint-disable-next-line @typescript-eslint/ban-types
            origin: function (origin, callback) {
                if (whitelist.indexOf(origin) !== -1) {
                    callback(null, true);
                }
                else {
                    callback(new Error(`The ${origin} origin is not allowed by CORS.`));
                }
            },
        };
        this._app.use(whitelist.length !== 0 ? (0, cors_1.default)(corsOptions) : (0, cors_1.default)());
        // This TypeScript code sets up logging for HTTP requests using the Morgan library, with options for formatting, skipping certain requests, and rotating log files.
        const pad = (num) => (num > 9 ? "" : "0") + num;
        const cwd = this._CONFIG.get(["APP", "CWD"]);
        const mrgn = new morgan_class_1.default();
        const skip = mrgn.skip(this._CONFIG.get(["HTTP-LOGS", "skip"]));
        const format = mrgn.format(this._CONFIG.get(["HTTP-LOGS", "format"]));
        const maxFiles = mrgn.maxFiles(this._CONFIG.get(["HTTP-LOGS", "MaxFiles"]));
        /**
         * The function `generator` takes a `time` parameter and returns a file path based on the current date and time.
         * @param {Date} time - The `time` parameter is a `Date` object that represents a specific point in time. It is used to generate a file name for a log file.
         * @returns The function `generator` returns a string representing a file path.
         */
        const generator = (time) => {
            if (!time)
                return node_path_1.default.join(cwd, "NotSign", "httpLog", "httpLog.log");
            const yearMonth = time.getFullYear() + "" + pad(time.getMonth() + 1);
            const day = pad(time.getDate());
            const hour = pad(time.getHours());
            const minute = pad(time.getMinutes());
            const fileName = `${yearMonth}${day}-${hour}${minute}-httpLog.log`;
            // const fileName: string = `${yearMonth}${day}-${index}-httpLog.log`;
            return node_path_1.default.join(cwd, "NotSign", "httpLog", `${yearMonth}${day}`, fileName);
        };
        const accessLogStream = rfs.createStream(generator(new Date()), {
            size: "10M", // rotate every 10 MegaBytes written
            interval: "1d", // rotate daily
            maxFiles: maxFiles || 10, // the maximum number of rotated files to be kept.
            // path: path.join(cwd, 'NotSign', 'httpLog')
        });
        // log -> morgan
        this._app.use((0, morgan_1.default)(format, {
            stream: accessLogStream,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            skip: function (req, res) {
                return skip;
            },
        }));
        // The line `this._app.use(express.json());` is setting up middleware in the Express app to parse JSON data in the request body.
        this._app.use(express_1.default.json());
        // The code `this._app.use('/api', this.routesApp);` is setting up a middleware in the Express app.
        // It specifies that any requests with a URL starting with '/api' should be handled by the `this.routesApp` router.
        this._app.use("/api", this.routesApp);
        // The code block you provided is a middleware function in an Express application. It is responsible for redirecting HTTP requests to HTTPS if SSL is active.
        this._app.use((req, res, next) => {
            try {
                if (this._bActiveSsl) {
                    if (req.protocol === "http") {
                        const uri = `https://${req.hostname}:${this._portHttps}${req.url}`;
                        // console.log('URI active ->', uri);
                        return res.redirect(301, uri);
                    }
                }
                next();
            }
            catch (error) {
                // The code block is responsible for logging an event message when the application fails to redirect a message
                const metadata = "";
                const appName = this._CONFIG.get(["APP", "SRV_NAME"]);
                const msg = `"${appName}" could not redirect the message`;
                if (this._LOGS)
                    this._LOGS.publishEvent(appName, msg, metadata);
            }
        });
    }
    /**
     * The function `checkPortHttp` checks if a given port number is valid for HTTP communication.
     *
     * @param {unknown} p_port - The parameter `p_port` is of type `unknown`, which means it can be any type.
     * In this case, it is expected to be a number representing a port number for an HTTP connection.
     * @returns a boolean value. True if the port is correct, otherwise false.
     */
    checkPortHttp(p_port) {
        let sal;
        try {
            if (typeof p_port === "number") {
                if (p_port === 80) {
                    sal = true;
                }
                else if (p_port === 443) {
                    sal = true;
                }
                else if (p_port <= 1024) {
                    sal = false;
                }
                else if (p_port > 65535) {
                    sal = false;
                }
                else if (isNaN(p_port)) {
                    sal = false;
                }
                else
                    sal = true;
            }
            else
                sal = false;
        }
        catch (error) {
            sal = false;
        }
        return sal;
    }
    /**
     * The getApp function returns the Express application.
     *
     * @return The `getApp()` method is returning an instance of the Express application.
     */
    getApp() {
        return this._app;
    }
    /**
     * The function `getParam` retrieves a parameter value from an application object and returns it as a
     * string, or an empty string if the parameter is undefined.
     *
     * @param p_param The parameter `p_param` is a string that represents the name of the parameter you want to retrieve from the `_app` object.
     * @return a string value.
     */
    getParam(p_param) {
        let sal;
        const data = this._app.get(p_param);
        if (data !== undefined)
            sal = data;
        else
            sal = "";
        return sal;
    }
    /**
     * The function sets a parameter with a given value in an application.
     *
     * @param p_param This parameter represents the name of the parameter you want to set. It should be a string value.
     * @param p_value The parameter `p_value` is a string that represents the value to be set for the parameter `p_param`.
     */
    setParam(p_param, p_value) {
        this._app.set(p_param, p_value);
    }
    /**
     * The function sets a router for a specific route in a TypeScript application.
     *
     * @param p_route The parameter `p_route` is of type `GetRouterInterface`.
     */
    setRouter(p_route) {
        if (p_route.router !== null)
            this.routesApp.use(p_route.route, p_route.router);
    }
}
exports.ExpressAppClass = ExpressAppClass;
