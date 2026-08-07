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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClientClass = void 0;
__exportStar(require("./enums"), exports);
__exportStar(require("./interfaces"), exports);
const http = __importStar(require("node:http"));
/**
 * Represents an HTTP client class.
 */
/**
 * Represents an HTTP client class.
 *
 * @example
 * const client = new HttpClientClass("myhost.com", 80, 5000);
 * client.config("myhost.com", 80, 5000);
 * client.sendVerbHttp("my/endpoint", HttpVerbsEnum.GET, undefined, undefined).then((resp) => console.log(resp));
 */
class HttpClientClass {
    /**
     * Creates an instance of HttpClientClass.
     * @param {string} [_hostname] - The hostname of the HTTP server.
     * @param {number} [_port] - The port of the HTTP server.
     * @param {number} [_timeout] - The timeout in milliseconds.
     */
    constructor(_hostname, _port, _timeout) {
        this._hostname = _hostname;
        this._port = _port;
        this._timeout = _timeout;
        /**
         * Configures the HTTP client.
         * @param {string} hostname - The hostname of the HTTP server.
         * @param {number} port - The port of the HTTP server.
         * @param {number} [timeout] - The timeout in milliseconds.
         */
        this.config = (hostname, port, timeout) => {
            this._hostname = hostname;
            this._port = port;
            this._timeout = timeout;
        };
        /**
         * Sends an HTTP verb request to the server.
         * @param {string} path - The path of the request.
         * @param {HttpVerbsEnum} method - The HTTP verb to use.
         * @param {QueryTypeInterface[]} [queries] - The query parameters to add to the request.
         * @param {string} [body] - The body of the request.
         * @returns {Promise<SendVerbHttpInterface>} - A promise that resolves with the response from the server.
         */
        this.sendVerbHttp = (path, method, queries, body) => {
            return new Promise((resolve, reject) => {
                try {
                    if (this._hostname === undefined) {
                        reject(new Error("hostname is undefined"));
                    }
                    if (this._port === undefined) {
                        reject(new Error("port is undefined"));
                    }
                    // Create the query string from the query parameters
                    let queryStr = "";
                    if (queries !== undefined) {
                        let queryConnector = "?";
                        queries.forEach((query) => {
                            const aux = `${query.key}=${query.value}`;
                            // Add the query parameter to the query string
                            // using the query connector (& or ?)
                            queryStr += queryConnector + aux;
                            queryConnector = "&";
                        });
                    }
                    // Get the content length of the body
                    const contentLength = Buffer.byteLength(body ?? "");
                    // Set the request options
                    const optionsPost = {
                        // The hostname of the server
                        hostname: this._hostname,
                        // The port of the server
                        port: this._port,
                        // The path of the request
                        path: path + queryStr,
                        // The HTTP verb to use
                        method: method,
                        // The headers of the request
                        headers: {
                            // The content type of the request
                            "Content-Type": "application/json",
                            // The content length of the request
                            "Content-Length": contentLength,
                            // The timeout of the request in milliseconds
                            timeout: this._timeout ?? 5000,
                        },
                    };
                    // Create the request object
                    const req = http.request(optionsPost, (res) => {
                        // Initialize the response data
                        let dataRx = "";
                        // Set the encoding of the response
                        res.setEncoding("utf8");
                        // Handle the data event of the response
                        res.on("data", (chunk) => {
                            // Add the chunk to the response data
                            dataRx += chunk;
                        });
                        // Handle the end event of the response
                        res.on("end", () => {
                            // Create the response object
                            const resp = {
                                // The response data
                                res: dataRx,
                                // The status code of the response
                                status: res.statusCode,
                            };
                            // Resolve the promise with the response object
                            resolve(resp);
                        });
                    });
                    // Handle the error event of the request
                    req.on("error", (e) => {
                        // Reject the promise with an error
                        reject(new Error(`VERB (${method}): ${e.message}`));
                    });
                    // Write the body to the request
                    req.write(body ?? "");
                    // End the request
                    req.end();
                }
                catch (error) {
                    // Reject the promise with an error
                    if (error instanceof Error)
                        reject(new Error(`VERB (${method}): ${error.message}`));
                }
            });
        };
    }
}
exports.HttpClientClass = HttpClientClass;
