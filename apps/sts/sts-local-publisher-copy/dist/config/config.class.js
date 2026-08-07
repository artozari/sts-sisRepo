"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigClass = void 0;
class ConfigClass {
    constructor() {
        // MQTT Configuration
        this.name = "MQTT";
        this.srvName = "STS_LOCAL_PUBLISHER";
        this.ip = "192.168.0.212";
        this.urlMqtt = "10.0.0.148";
        this.portMqtt = "8883";
        this.username = "Cartel";
        this.password = "Mqtt123.";
        this.portHttp = "6000";
        this.portHttps = "6001";
        this.protocol = "ws";
        this.serviceId = "sts_local_publisher_100";
    }
}
exports.ConfigClass = ConfigClass;
