"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigCasinoClass = void 0;
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
class ConfigCasinoClass {
    constructor() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        this.name = (_a = process.env.CASINO_MQTT_NAME) !== null && _a !== void 0 ? _a : "sielcondev01/9105";
        this.srvName = (_b = process.env.CASINO_SRV_NAME) !== null && _b !== void 0 ? _b : "STS_LOCAL_PUBLISHER";
        this.ip = (_c = process.env.CASINO_IP) !== null && _c !== void 0 ? _c : "192.168.0.212";
        this.urlMqtt = (_d = process.env.CASINO_URL_MQTT) !== null && _d !== void 0 ? _d : "dev01.sielcon.net";
        this.portMqtt = (_e = process.env.CASINO_PORT_MQTT) !== null && _e !== void 0 ? _e : "9105";
        this.username = (_f = process.env.CASINO_USERNAME) !== null && _f !== void 0 ? _f : "";
        this.password = (_g = process.env.CASINO_PASSWORD) !== null && _g !== void 0 ? _g : "";
        this.portHttp = (_h = process.env.CASINO_PORT_HTTP) !== null && _h !== void 0 ? _h : "6000";
        this.portHttps = (_j = process.env.CASINO_PORT_HTTPS) !== null && _j !== void 0 ? _j : "6001";
        this.protocol = (_k = process.env.CASINO_PROTOCOL) !== null && _k !== void 0 ? _k : "ws";
        this.serviceId = (_l = process.env.CASINO_SERVICE_ID) !== null && _l !== void 0 ? _l : "sts_local_publisher_100";
    }
}
exports.ConfigCasinoClass = ConfigCasinoClass;
