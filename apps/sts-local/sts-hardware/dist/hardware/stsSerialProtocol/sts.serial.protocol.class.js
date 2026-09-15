"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StsSerialProtocolClass {
    constructor() {
        this._timeController = 0;
        this._tagController = new Uint8Array(8);
        this._errorController = 0;
        this._state = 0;
        this._keys = 0;
        this._accX = 0;
        this._accY = 0;
        this._accZ = 0;
        this.msgPeriodicRx = (p_buffer) => {
            let result;
            try {
                const time = p_buffer.slice(0, 4);
                const time32 = new Uint32Array(time.buffer);
                this._timeController = time32[0];
                this._tagController = p_buffer.slice(5, 13);
                this._state = p_buffer[13];
                this._keys = p_buffer[14];
                let acc = p_buffer.slice(15, 17);
                let acc16 = new Uint16Array(acc.buffer);
                this._accX = acc16[0];
                acc = p_buffer.slice(17, 19);
                acc16 = new Uint16Array(acc.buffer);
                this._accY = acc16[0];
                acc = p_buffer.slice(19, 21);
                acc16 = new Uint16Array(acc.buffer);
                this._accZ = acc16[0];
                this._errorController = p_buffer[21];
                result = true;
            }
            catch (error) {
                result = false;
            }
            return result;
        };
        const msgPeriodic = new Uint8Array([
            0x11, 0x11, 0x12, 0x13, 0x43,
            0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27,
            3, 6, 0xA0, 0, 0xB0, 0, 0xC0, 0, 1, 0xe0, 0xe1, 0xe2, 0xe3
        ]);
        this.msgPeriodicRx(msgPeriodic);
    }
}
exports.default = StsSerialProtocolClass;
