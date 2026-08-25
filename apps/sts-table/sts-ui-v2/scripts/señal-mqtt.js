const crypto = require("node:crypto");
const mqtt = require("mqtt");

const brokerUrl = process.env.MQTT_BROKER_URL || "ws://dev01.sielcon.net:9105";
const publishInterval = Number(process.env.MQTT_PUBLISH_INTERVAL_MS || 30000);
const cutoffUrl = process.env.CUTOFF_BASE_URL || "http://localhost:3000";
const clientId = process.env.MQTT_CLIENT_ID || `slcn_ui_v2_${crypto.randomBytes(4).toString("hex")}`;

const client = mqtt.connect(brokerUrl, {
    clientId,
    keepalive: 30,
    connectTimeout: 10000,
    reconnectPeriod: 5000,
    clean: true,
});

async function publishCutoff() {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(`${cutoffUrl}/lastCutOff`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        client.publish("cutoff/enable", JSON.stringify(data), { qos: 1 }, (err) => {
            if (err) {
                console.error("Publish error:", err.message || err);
            } else {
                console.log("Published cutoff data to cutoff/enable topic");
            }
        });
    } catch (err) {
        console.error("Error obteniendo el estado de corte:", err?.message || err);
    }
}

client.on("connect", () => {
    console.log("Connected to MQTT broker:", brokerUrl, "clientId:", clientId);
    client.subscribe("cutoff/enable", { qos: 1 }, (err) => {
        if (err) {
            console.error("Subscribe error:", err.message || err);
            return;
        }
        console.log("Subscribed to cutoff/enable topic");
    });

    client.publish("cutoff/enable", "true", { qos: 1 }, (err) => {
        if (err) {
            console.error("Publish error:", err.message || err);
        } else {
            console.log("Published 'true' to cutoff/enable topic");
        }
    });
    publishCutoff();
    setInterval(publishCutoff, publishInterval);
});

client.on("reconnect", () => {
    console.log("Reconnecting to MQTT broker...");
});

client.on("close", () => {
    console.log("MQTT connection closed");
});

client.on("offline", () => {
    console.log("MQTT client is offline");
});

client.on("error", (err) => {
    console.error("MQTT error:", err?.message || err);
});

client.on("message", (topic, message) => {
    console.log("MQTT message received:", topic, message.toString());
});