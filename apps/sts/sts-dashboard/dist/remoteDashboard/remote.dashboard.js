"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteDashboardClass = void 0;
class RemoteDashboardClass {
    constructor(_localMQTT, _remoteMQTT) {
        this._localMQTT = _localMQTT;
        this._remoteMQTT = _remoteMQTT;
        const subsTopicSignBoard = {
            topic: `sts/dashboard/local/#`,
            qos: 0,
        };
        _localMQTT.subscribe$.next(subsTopicSignBoard);
        // The code block processes the received MQTT messages.
        _localMQTT.rx$.subscribe({
            next: (v) => {
                try {
                    const parts = v.topic;
                    if (parts[0] === "sts" && parts[1] === "dashboard" && parts[2] === "local" && parts.length === 5) {
                        if (_remoteMQTT !== null) {
                            _remoteMQTT.tx$.next({
                                topic: `${parts[0]}/${parts[1]}/remote/${parts[3]}/${parts[4]}`,
                                payload: v.payload,
                                qos: 0,
                                retain: false,
                            });
                        }
                    }
                }
                catch (error) {
                    // empty
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            error: (error) => {
                /* empty */
            },
        });
    }
}
exports.RemoteDashboardClass = RemoteDashboardClass;
