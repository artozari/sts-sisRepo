"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcsWheelClass = void 0;
const serialport_1 = require("serialport");
const tcs_protocol_1 = require("../TcsProtocol/tcs.protocol");
class TcsWheelClass {
    constructor(_config) {
        this._config = _config;
        this._port = undefined;
        this.txPolling = () => {
            try {
                if (this._port !== undefined) {
                    const msgPolling = this._tcsProtocol.tx(tcs_protocol_1.TxTypeEnum.POLLING);
                    if (msgPolling !== false) {
                        this._port.write(msgPolling);
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        };
        this.publishStateMqtt = (p_state) => {
            try {
                const topic = `sts/wheel/${this._config.serviceId}/state`;
                const dataTx = {
                    topic,
                    payload: JSON.stringify(p_state),
                    qos: 0,
                    retain: false
                };
                this._config.mqttSubject.tx$.next(dataTx);
            }
            catch (error) {
                // empty
            }
        };
        this.callBack = (p_state) => {
            this.publishStateMqtt(p_state);
        };
        this._tcsProtocol = new tcs_protocol_1.TcsProtocolClass(false, this.callBack);
        this._port = new serialport_1.SerialPort({
            path: _config.port,
            baudRate: _config.baudRate,
            dataBits: _config.dataBits,
            stopBits: _config.stopBits,
            parity: _config.parity
        }, (err) => {
            if (err) {
                this._port = undefined;
                return console.log('Error: ', err.message);
            }
            console.log('Connected to: ', _config.port);
            // Switches the port into "flowing mode"
            if (this._port !== undefined) {
                this._port.on('data', (data) => {
                    this._tcsProtocol.rx(data);
                });
            }
        });
        setInterval(this.txPolling, 500);
    }
}
exports.TcsWheelClass = TcsWheelClass;
