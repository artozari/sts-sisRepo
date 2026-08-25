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

export class ConfigCasinoClass {
    // MQTT Configuration
    public name = process.env.CASINO_MQTT_NAME ?? "sielcondev01/9105";
    public srvName = process.env.CASINO_SRV_NAME ?? "STS_LOCAL_PUBLISHER";
    public ip = process.env.CASINO_IP ?? "192.168.0.212";
    public urlMqtt = process.env.CASINO_URL_MQTT ?? "dev01.sielcon.net";
    public portMqtt = process.env.CASINO_PORT_MQTT ?? "9105";
    public username = process.env.CASINO_USERNAME ?? "";
    public password = process.env.CASINO_PASSWORD ?? "";
    public portHttp = process.env.CASINO_PORT_HTTP ?? "6000";
    public portHttps = process.env.CASINO_PORT_HTTPS ?? "6001";
    public protocol = process.env.CASINO_PROTOCOL ?? "ws";
    public serviceId = process.env.CASINO_SERVICE_ID ?? "sts_local_publisher_100";
}
