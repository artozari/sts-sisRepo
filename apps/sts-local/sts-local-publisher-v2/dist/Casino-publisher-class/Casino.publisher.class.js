"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasinoPublisherClass = void 0;
class CasinoPublisherClass {
    constructor(_config) {
        this._config = _config;
        this.requestSync = 0;
        this.publishMqtt = (p_dataTx) => {
            try {
                this._config.subject.tx$.next(p_dataTx);
            }
            catch (error) {
                console.error(error);
            }
        };
        this.start = () => {
            console.info("Casino Publisher Started");
        };
        const topics = [
            { topic: `STS-MESAS/+/STS-Casino/GameSync/#`, qos: 0 },
            { topic: `STS-MESAS/STS-Casino/GameSync/#`, qos: 0 },
        ];
        for (const t of topics) {
            _config.subject.subscribe$.next(t);
        }
        _config.subject.rx$.subscribe({
            next: (v) => {
                try {
                    const topicString = Array.isArray(v.topic) ? v.topic.join("/") : v.topic;
                    const parts = topicString.split("/");
                    const last = parts[parts.length - 1];
                    console.log(last);
                    if (/^\d+$/.test(last)) {
                        this.requestSync = 1;
                    }
                }
                catch (error) {
                    console.error(error);
                }
            },
            error: (error) => {
                console.error(error);
            },
        });
    }
    pushGamesToCasino(payload) {
        try {
            console.log("\x1b[36;47;1m Envio de pyload \x1b[0m");
        }
        catch (error) {
            console.error("Error pushing games to casino:", error);
        }
    }
}
exports.CasinoPublisherClass = CasinoPublisherClass;
