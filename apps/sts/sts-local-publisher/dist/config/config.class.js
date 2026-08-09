"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigClass = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const envCandidates = [path_1.default.resolve(process.cwd(), ".env"), path_1.default.resolve(__dirname, "..", ".env"), path_1.default.resolve(__dirname, ".env")];
for (const envPath of envCandidates) {
    if (fs_1.default.existsSync(envPath)) {
        dotenv_1.default.config({ path: envPath });
        break;
    }
}
class ConfigClass {
    constructor() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        this.name = (_a = process.env.LOCAL_MQTT_NAME) !== null && _a !== void 0 ? _a : "MQTT";
        this.srvName = (_b = process.env.LOCAL_SRV_NAME) !== null && _b !== void 0 ? _b : "STS_LOCAL_PUBLISHER";
        this.ip = (_c = process.env.LOCAL_IP) !== null && _c !== void 0 ? _c : "192.168.0.212";
        this.urlMqtt = (_d = process.env.LOCAL_URL_MQTT) !== null && _d !== void 0 ? _d : "10.0.0.147";
        this.portMqtt = (_e = process.env.LOCAL_PORT_MQTT) !== null && _e !== void 0 ? _e : "8883";
        this.username = (_f = process.env.LOCAL_USERNAME) !== null && _f !== void 0 ? _f : "Cartel";
        this.password = (_g = process.env.LOCAL_PASSWORD) !== null && _g !== void 0 ? _g : "Mqtt123.";
        this.portHttp = (_h = process.env.LOCAL_PORT_HTTP) !== null && _h !== void 0 ? _h : "6000";
        this.portHttps = (_j = process.env.LOCAL_PORT_HTTPS) !== null && _j !== void 0 ? _j : "6001";
        this.protocol = (_k = process.env.LOCAL_PROTOCOL) !== null && _k !== void 0 ? _k : "ws";
        this.serviceId = (_l = process.env.LOCAL_SERVICE_ID) !== null && _l !== void 0 ? _l : "sts_local_publisher_100";
    }
}
exports.ConfigClass = ConfigClass;
