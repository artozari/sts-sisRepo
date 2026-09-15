"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HardwareClass = void 0;
const serialCom_class_1 = __importDefault(require("./comm/serialCom.class"));
class HardwareClass {
    constructor(_CONFIG, _mqttSubject, _logger) {
        this._CONFIG = _CONFIG;
        this._mqttSubject = _mqttSubject;
        this._logger = _logger;
        this._serviceId = null;
        this.rxCallBack = (p_data) => {
            const srv = this.getServiceId();
            const topic = `sts/Hardware/${srv}/rx`;
            const dataTx = {
                topic,
                payload: JSON.stringify(p_data),
                qos: 0,
                retain: false,
            };
            this._mqttSubject.tx$.next(dataTx);
        };
        this.publishStateMqtt = () => {
            const srv = this.getServiceId();
            const topic = `sts/Hardware/${srv}/state`;
            const data = {
                state: this._serial.isOpen,
                comm: this._comm,
                date: new Date(),
            };
            const dataTx = {
                topic,
                payload: JSON.stringify(data),
                qos: 0,
                retain: false,
            };
            this._mqttSubject.tx$.next(dataTx);
        };
        this.getServiceId = () => {
            let srv;
            try {
                if (this._serviceId !== null)
                    srv = this._serviceId;
                else
                    srv = "srv-unknown";
            }
            catch (error) {
                srv = "srv-unknown";
            }
            return srv;
        };
        this._comm = this._CONFIG.get(["COMM", "port"]);
        this._serial = new serialCom_class_1.default(this.rxCallBack, this._comm, 19200, 8, 1, "none", this._logger);
        this._serviceId = _CONFIG.getServiceId(false);
        const subsTopic = {
            topic: `sts/Hardware/${this.getServiceId()}/tx`,
            qos: 0,
        };
        _mqttSubject.subscribe$.next(subsTopic);
        // The code block processes the received MQTT messages.
        _mqttSubject.rx$.subscribe({
            next: (v) => {
                try {
                    const parts = v.topic;
                    if (parts[0] === "sts") {
                        this._serial.setValues(JSON.parse(v.payload));
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
        this.publishStateMqtt();
        setInterval(this.publishStateMqtt, 5000);
    }
}
exports.HardwareClass = HardwareClass;
