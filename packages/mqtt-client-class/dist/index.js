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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttClientClass = void 0;
const mqtt = __importStar(require("mqtt"));
const pidusage_1 = __importDefault(require("pidusage"));
const datetime_class_1 = require("datetime-class");
__exportStar(require("./interfaces"), exports);
/**
 * The `MqttClientClass` is class that represents an MQTT client and provides methods for connecting to an MQTT broker,
 * publishing and subscribing to topics, and monitoring the client's status.
 */
class MqttClientClass {
    /**
     * This function initializes a MQTT client with the provided configuration and sets up a periodic task to monitor the process ID usage.
     * @param {MqttClientConfigInterface} _mqttClientConfig - An interface that contains the configuration for the MQTT client.
     * @param {LogSystemClass} _LOGS - The `_LOGS` parameter is an instance of the `LogSystemClass` class, which is used for logging system messages and errors.
     */
    constructor(_mqttClientConfig, _LOGS) {
        this._mqttClientConfig = _mqttClientConfig;
        this._LOGS = _LOGS;
        this._pidUsage = {};
        this._clientId = "";
        this._aliveTopic = "";
        this._protocol = "wss";
        this._client = undefined;
        this._pidUsageInterval = undefined;
        this._aliveInterval = undefined;
        this._connectionMonitorInterval = undefined;
        this._aliveSubscribed = false;
        this.mqttClientAlive = undefined;
        this._strID = "";
        /**
         * The `publish` method is used to publish a message to an MQTT topic. It takes the following parameters:
         * @param {string} p_topic - The topic to which the message will be published.
         * @param {string | Buffer} p_payload - The payload of the message, which can be a string or a Buffer.
         * @param {mqtt.QoS | undefined} p_qos - The quality of service level for the message. It is an optional parameter and defaults to 0.
         * @param {boolean | undefined} p_retain - A boolean value indicating whether the message should be retained by the broker. It is an optional parameter and defaults to false.
         */
        this.publish = (p_topic, p_payload, p_qos = undefined, p_retain = undefined) => {
            try {
                if (this._client !== undefined) {
                    const qos = p_qos ?? 0;
                    const retain = p_retain ?? false;
                    const opts = {
                        qos: qos,
                        retain: retain,
                    };
                    this._client.publish(p_topic, p_payload, opts);
                }
            }
            catch (err) {
                if (this._LOGS)
                    this._LOGS.publishError(err);
            }
        };
        /**
         * The `subscribe` method is used to subscribe to one or more MQTT topics. It takes the following parameters
         * @param {string | string[]} p_topic - The topic to which the message will be subscribed.
         * @param {mqtt.QoS | undefined} p_qos - The quality of service level for the message. It is an optional parameter and defaults to 0.
         */
        this.subscribe = (p_topic, p_qos = undefined) => {
            return new Promise((resolve, reject) => {
                try {
                    if (this._client !== undefined) {
                        const qos = p_qos ?? 0;
                        const opts = {
                            qos: qos,
                            // qos: qos
                        };
                        this._client.subscribe(p_topic, opts, (err) => {
                            if (err === undefined)
                                throw err;
                            resolve(true);
                        });
                    }
                    else {
                        resolve(false);
                    }
                }
                catch (err) {
                    if (this._LOGS)
                        this._LOGS.publishError(err);
                    reject(err);
                }
            });
        };
        /**
         * The `unsubscribe` method is used to unsubscribe from one or more MQTT topics. It takes a topic or an array of topics as a parameter.
         * @param {string | string[]} p_topic - The topic to which the message will be unsubscribed.
         * @return {Promise<boolean>} It returns a promise that resolves to a boolean value indicating whether the unsubscribe operation was successful or not.
         */
        this.unsubscribe = (p_topic) => {
            return new Promise((resolve, reject) => {
                try {
                    if (this._client !== undefined) {
                        this._client.unsubscribe(p_topic, (err) => {
                            if (err === undefined)
                                throw err;
                            resolve(true);
                        });
                    }
                    else {
                        resolve(false);
                    }
                }
                catch (err) {
                    if (this._LOGS)
                        this._LOGS.publishError(err);
                    reject(err);
                }
            });
        };
        /**
         *  The `publishAlive` function is responsible for publishing the MQTT client's alive status to a specific topic.
         * It retrieves the current CPU usage, memory usage, and elapsed time since the process started using the `pidusage` library.
         * It then formats this information into a JSON object and publishes it to the `_aliveTopic` using the `publish` method of the MQTT client.
         * If any error occurs during this process, it is logged using the `_LOGS.publishError` method.
         */
        this.publishAlive = () => {
            try {
                if (this.mqttClientAlive !== undefined) {
                    const mmnt = new datetime_class_1.DatetimeClass();
                    this.mqttClientAlive.ts = mmnt.utc_toISO();
                    this.mqttClientAlive.cpu = this._pidUsage.cpu.toFixed() + "%";
                    this.mqttClientAlive.memory = (this._pidUsage.memory / (1024 * 1024)).toFixed() + "Mb";
                    this.mqttClientAlive.elapsed = mmnt.millis_toStr(this._pidUsage.elapsed);
                    this.publish(this._aliveTopic, JSON.stringify(this.mqttClientAlive), 1, true);
                }
            }
            catch (err) {
                if (this._LOGS)
                    this._LOGS.publishError(err);
            }
        };
        /**
         * The `pidUsage` function is a private method of the `MqttClientClass` that is responsible for retrieving and saving the current process ID usage statistics.
         * It uses the `pidusage` library to get the CPU usage, memory usage, parent process ID (PPID), process ID (PID), CPU time, elapsed time since the start of the process, and timestamp.
         */
        this.pidUsage = () => {
            (0, pidusage_1.default)(process.pid, (err, stats) => {
                // save the stats
                if (err === null) {
                    this._pidUsage = stats;
                }
                // => {
                //   cpu: 10.0,            // percentage (from 0 to 100*vcore)
                //   memory: 357306368,    // bytes
                //   ppid: 312,            // PPID
                //   pid: 727,             // PID
                //   ctime: 867000,        // ms user + system time
                //   elapsed: 6650000,     // ms since the start of the process
                //   timestamp: 864000000  // ms since epoch
                // }
                // cb()
            });
        };
        this.close = () => {
            try {
                if (this._aliveInterval !== undefined) {
                    clearInterval(this._aliveInterval);
                    this._aliveInterval = undefined;
                }
                if (this._pidUsageInterval !== undefined) {
                    clearInterval(this._pidUsageInterval);
                    this._pidUsageInterval = undefined;
                }
                if (this._connectionMonitorInterval !== undefined) {
                    clearInterval(this._connectionMonitorInterval);
                    this._connectionMonitorInterval = undefined;
                }
                if (this._client !== undefined) {
                    this._client.end();
                    this._client = undefined;
                }
            }
            catch (err) {
                if (this._LOGS)
                    this._LOGS.publishError(err);
            }
        };
        this.isConected = (p_log = true) => {
            let resp;
            try {
                if (this._client !== undefined) {
                    resp = this._client.connected;
                }
                else {
                    resp = false;
                }
            }
            catch (err) {
                resp = false;
                if (p_log && this._LOGS)
                    this._LOGS.publishError(err);
            }
            return resp;
        };
        this.publishEvents = (p_event) => {
            try {
                //observable -> publish
                this._mqttClientConfig.subject.events$.next(p_event);
            }
            catch (error) {
                // empty
            }
        };
        try {
            this._strID = `${_mqttClientConfig.serviceId}`;
            this._strID = _mqttClientConfig.name !== undefined ? `${_mqttClientConfig.name}_${this._strID}` : this._strID;
            this._strID = `slcn_${this._strID}`;
            this._clientId = this._strID;
            this._aliveTopic = `alive-service/${this._strID}`;
            this.mqttClientAlive = {
                srvName: _mqttClientConfig.srvName,
                ip: _mqttClientConfig.ip,
                portHttp: _mqttClientConfig.portHttp,
                portHttps: _mqttClientConfig.portHttps,
                ts: "",
                error: false,
                cpu: "undefined",
                memory: "undefined",
                pid: process.pid.toString(),
                ppid: process.ppid.toString(),
                elapsed: "0msec",
            };
            const username = _mqttClientConfig.username ? _mqttClientConfig.username.toString() : "";
            const password = _mqttClientConfig.password ? _mqttClientConfig.password.toString() : "";
            const options = {
                // Clean session
                clean: true,
                connectTimeout: 4000,
                username,
                password,
                clientId: this._clientId,
                rejectUnauthorized: false,
            };
            // Switch statement of the `_mqttClientConfig.protocol` property. It sets the `_protocol` property of the `MqttClientClass` instance to a specific protocol string.
            switch (_mqttClientConfig.protocol) {
                case "mqtt":
                case "mqtts":
                case "ws":
                case "wss":
                    this._protocol = _mqttClientConfig.protocol;
                    break;
                default:
                    this._protocol = "wss";
                    break;
            }
            const fullUrl = `${this._protocol}://${this._mqttClientConfig.urlMqtt}:${this._mqttClientConfig.portMqtt}`;
            this._client = mqtt.connect(fullUrl, options);
            this.pidUsage();
            this._pidUsageInterval = setInterval(this.pidUsage, 1000);
            this._connectionMonitorInterval = setInterval(() => {
                const connect = this.isConected(false) ? "connected" : "disconnected";
                this.publishEvents(connect);
            }, 100);
        }
        catch (err) {
            if (this._LOGS)
                this._LOGS.publishError(err);
        }
    }
    /**
     * The `start` function sets up event listeners for MQTT client connection, message reception, reconnection, and error handling.
     */
    start() {
        try {
            if (this._client !== undefined) {
                // mqttClientAliveInterface
                this._client.on("connect", () => {
                    console.log(`MQTT Client "${this._strID}" is connected..`);
                    this.publishEvents("connect");
                    const name = __filename;
                    const msg = `The MQTT of the "${this._mqttClientConfig.srvName}" is running at ${this._mqttClientConfig.urlMqtt}:${this._mqttClientConfig.portMqtt} with the "${this._protocol}" protocol.`;
                    const metadata = "";
                    if (this._LOGS)
                        this._LOGS.publishWarn(name, msg, metadata);
                    if (this._client !== undefined) {
                        if (this._aliveInterval === undefined) {
                            this._aliveInterval = setInterval(() => {
                                this.publishAlive();
                            }, 5000);
                        }
                        if (!this._aliveSubscribed) {
                            this._client.subscribe(this._aliveTopic, (err) => {
                                if (!err) {
                                    this._aliveSubscribed = true;
                                    setTimeout(() => {
                                        this.publishAlive();
                                    }, 500);
                                }
                            });
                        }
                    }
                });
                // The code block processes the received MQTT messages.
                this._mqttClientConfig.subject.tx$.subscribe({
                    next: (v) => {
                        this.publish(v.topic, v.payload, v.qos, v.retain);
                    },
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    error: (error) => {
                        /* empty */
                    },
                    // _LOGS.publishError(<Error>e);
                });
                // The code block processes the received MQTT messages.
                this._mqttClientConfig.subject.subscribe$.subscribe({
                    next: (v) => {
                        this.subscribe(v.topic, v.qos);
                        console.log("Subscribe: ", v.topic, v.qos);
                    },
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    error: (error) => {
                        /* empty */
                    },
                    // _LOGS.publishError(<Error>e);
                });
                this._client.on("message", (topic, message) => {
                    // split the MQTT topic
                    const topicSplited = topic.split("/");
                    this.publishEvents("message");
                    //observable -> publish
                    this._mqttClientConfig.subject.rx$.next({
                        topic: topicSplited,
                        payload: message.toString(),
                    });
                });
                this._client.on("reconnect", () => {
                    this.publishEvents("reconnect");
                    const strErr = `Reconnect MQTT "${this._mqttClientConfig.urlMqtt}:${this._mqttClientConfig.portMqtt}"`;
                    if (this._LOGS) {
                        this._LOGS.publishError(new Error(strErr));
                    }
                    else {
                        console.log(`MQTT client "${this._strID}" is reconnecting`);
                    }
                });
                this._client.on("error", (err) => {
                    this.publishEvents("error");
                    if (this._LOGS) {
                        this._LOGS.publishError(err);
                    }
                    else {
                        console.log(`Error in MQTT client "${this._strID}": ${err.message}`);
                    }
                });
            }
        }
        catch (err) {
            if (this._LOGS)
                this._LOGS.publishError(err);
        }
    }
}
exports.MqttClientClass = MqttClientClass;
