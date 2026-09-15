import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const envCandidates = [path.resolve(process.cwd(), ".env"), path.resolve(__dirname, "..", ".env"), path.resolve(__dirname, ".env")];

for (const envPath of envCandidates) {
    if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath });
        break;
    }
}

export class ConfigClass {
    // MQTT Configuration
    public name = process.env.LOCAL_MQTT_NAME ?? "MQTT";
    public srvName = process.env.LOCAL_SRV_NAME ?? "STS_LOCAL_PUBLISHER";
    public ip = process.env.LOCAL_IP ?? "192.168.0.212";
    public urlMqtt = process.env.LOCAL_URL_MQTT ?? "10.0.0.147";
    public portMqtt = process.env.LOCAL_PORT_MQTT ?? "8883";
    public username = process.env.LOCAL_USERNAME ?? "Cartel";
    public password = process.env.LOCAL_PASSWORD ?? "Mqtt123.";
    public portHttp = process.env.LOCAL_PORT_HTTP ?? "6000";
    public portHttps = process.env.LOCAL_PORT_HTTPS ?? "6001";
    public protocol = process.env.LOCAL_PROTOCOL ?? "ws";
    public serviceId = process.env.LOCAL_SERVICE_ID ?? "sts_local_publisher_100";
}
