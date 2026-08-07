"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigCasinoClass = void 0;
class ConfigCasinoClass {
    constructor() {
        // MQTT Configuration
        this.name = "sielcondev01/9105";
        this.srvName = "STS_LOCAL_PUBLISHER";
        this.ip = "192.168.0.212";
        this.urlMqtt = "dev01.sielcon.net";
        this.portMqtt = "9105";
        this.username = "";
        this.password = "";
        this.portHttp = "6000";
        this.portHttps = "6001";
        this.protocol = "ws";
        this.serviceId = "sts_local_publisher_100";
    }
}
exports.ConfigCasinoClass = ConfigCasinoClass;
