"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crc_class_1 = require("@slcn-pkg/crc-class");
const serialport_1 = require("serialport");
const sts_serial_protocol_class_1 = __importDefault(require("../stsSerialProtocol/sts.serial.protocol.class"));
const sts_common_1 = require("sts-common");
const general_logger_constants_1 = require("@slcn-pkg/general-logger-constants");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcd = require("bcd");
class SerialComClass {
    constructor(_rxCallBack, _port, _baudRate, _dataBits, _stopBits, _parity, _logger) {
        this._rxCallBack = _rxCallBack;
        this._port = _port;
        this._baudRate = _baudRate;
        this._dataBits = _dataBits;
        this._stopBits = _stopBits;
        this._parity = _parity;
        this._logger = _logger;
        this._lastRx = null;
        this.stsSerialProtocol = new sts_serial_protocol_class_1.default();
        this._crc = new crc_class_1.Crc32Class();
        this.reOpen = () => {
            if (this.isOpen === false) {
                this._serial.open();
            }
        };
        this.checkCrc = (p_buff) => {
            let resp = false;
            try {
                if (p_buff.length > 4) {
                    const crcRx = p_buff.slice(p_buff.length - 4);
                    p_buff.set([115, 76, 99, 78], p_buff.length - 4);
                    const crcCalc = this._crc.calculate(p_buff, p_buff.length);
                    if (crcCalc !== false) {
                        if (crcCalc.length === crcRx.length) {
                            for (let i = 0; i < crcRx.length; i++) {
                                if (crcCalc[i] !== crcRx[i])
                                    throw new Error();
                            }
                            resp = true;
                        }
                    }
                }
            }
            catch (error) {
                resp = false;
            }
            return resp;
        };
        this.generateRespMsg = (p_time, p_state, p_tableNum, p_lightsIntensity, p_colorOfLights, p_semaphore, p_semaphoreLights) => {
            let resp = false;
            try {
                const arrayTime = p_time;
                const arrayDevice = new Uint8Array([0x53]);
                const arrayState = new Uint8Array([p_state]);
                const arrayTable = new Uint8Array(bcd.encode(p_tableNum));
                const arrayGame = new Uint8Array([0x00]); //	0; //new Uint8Array(bcd.encode(p_gameNum));
                // const arrayLight: Uint8Array = this.numToUint8Array(<number>p_light, 2);
                const arrayColorOfLights = this.numToUint8Array(p_colorOfLights, 1);
                const arrayLightsIntensity = this.numToUint8Array(p_lightsIntensity, 1);
                const arraySemaphore = this.numToUint8Array(p_semaphore, 1);
                const arraySemaphoreLights = this.numToUint8Array(p_semaphoreLights, 1);
                const arrayCrc = this.numToUint8Array(0x4e634c73, 4);
                const bufferTx = new Uint8Array(17);
                bufferTx.set(arrayTime, 0);
                bufferTx.set(arrayDevice, 4);
                bufferTx.set(arrayState, 5);
                bufferTx.set(arrayTable, 6);
                bufferTx.set(arrayGame, 7);
                bufferTx.set(arrayColorOfLights, 9);
                bufferTx.set(arrayLightsIntensity, 10);
                bufferTx.set(arraySemaphore, 11);
                bufferTx.set(arraySemaphoreLights, 12);
                bufferTx.set(arrayCrc, 13);
                const crcCalc = this._crc.calculate(bufferTx, bufferTx.length);
                if (crcCalc !== false) {
                    bufferTx.set(crcCalc, 13);
                    const encrypt = this.encrypt(bufferTx);
                    resp = "#";
                    for (const byte of encrypt) {
                        resp = resp + byte.toString(16).padStart(2, "0");
                    }
                    resp = resp + ";";
                }
            }
            catch (error) {
                resp = false;
            }
            return resp;
        };
        this.numToUint8Array = (p_num, p_lenght) => {
            const arr = new Uint8Array(p_lenght);
            for (let i = 0; i < p_lenght; i++) {
                arr[i] = p_num % 256;
                p_num = Math.floor(p_num / 256);
            }
            return arr;
        };
        this.encrypt = (p_buff) => {
            const lg = p_buff.length;
            const arr = new Uint8Array(lg);
            arr[0] = p_buff[0];
            for (let i = 0; i < lg - 1; i++) {
                arr[i + 1] = p_buff[i] ^ p_buff[i + 1];
            }
            return arr;
        };
        this.decrypt = (p_buff) => {
            const lg = p_buff.length;
            const arr = new Uint8Array(lg);
            arr[0] = p_buff[0];
            for (let i = 0; i < lg - 1; i++) {
                arr[i + 1] = arr[i] ^ p_buff[i + 1];
            }
            return arr;
        };
        this.setValues = (p_data) => {
            this._values = p_data;
            const arrayTime = new Uint8Array(4);
            let num = p_data.time;
            for (let i = 0; i < 4; i++) {
                arrayTime[i] = num % 256;
                num = Math.floor(num / 256);
            }
            const display = this._values.SevenSegmentDisplay !== 255 ? this._values.SevenSegmentDisplay : 255;
            const colorOfLights = this._values.colorOfLights;
            const lightsIntensity = this._values.lightsIntensity;
            const semaphoreIntensity = this._values.semaphoreIntensity;
            const semaphoreLights = this._values.semaphoreLights;
            const semaphore = (semaphoreIntensity << 4) + this._values.semaphore;
            const strTx = this.generateRespMsg(arrayTime, 1, display, lightsIntensity, colorOfLights, semaphore, semaphoreLights);
            if (strTx !== false) {
                this.write(strTx);
            }
        };
        this._values = {
            time: 0,
            key: "",
            keyType: 0,
            semaphore: sts_common_1.StsSemaphoreEnum.RED,
            semaphoreLights: 15,
            semaphoreIntensity: 5,
            colorOfLights: sts_common_1.EffectsLedLightsEnum.LowRed,
            lightsIntensity: 0,
            SevenSegmentDisplay: 0,
        };
        this._strRx = "";
        this._serial = new serialport_1.SerialPort({
            path: this._port,
            baudRate: this._baudRate,
            dataBits: this._dataBits,
            stopBits: this._stopBits,
            parity: this._parity,
            autoOpen: true,
        });
        const pepa = new Uint8Array([10, 11, 12, 86, 146, 6, 43]);
        this.checkCrc(pepa);
        setInterval(this.reOpen, 1000);
        this._serial.on("open", () => {
            this._logger.proc(general_logger_constants_1.LevelsLoggerEnum.info, `Connection established on port: ${this._port}`);
        });
        this._serial.on("error", function (err) {
            _logger.proc(general_logger_constants_1.LevelsLoggerEnum.error, `${err.message}`);
        });
        this._serial.on("data", (data) => {
            const dataRx = data.toString();
            for (const charRx of dataRx) {
                if (charRx === "#")
                    this._strRx = "";
                else if ((charRx >= "0" && charRx <= "9") || (charRx >= "A" && charRx <= "F"))
                    this._strRx += charRx;
                else if (charRx === ";") {
                    const pepe = this._strRx.match(/[\da-f]{2}/gi);
                    if (pepe !== null) {
                        const typedArray = new Uint8Array(pepe.map(function (h) {
                            return parseInt(h, 16);
                        }));
                        const decrypt = this.decrypt(typedArray);
                        const bCheckCrc = this.checkCrc(decrypt);
                        if (bCheckCrc) {
                            const buffTime = decrypt.slice(0, 4);
                            const buffTime32 = new Uint32Array(buffTime.buffer);
                            const key = decrypt.slice(6, 12);
                            const strKey = key[0].toString(16).padStart(2, "0") +
                                key[1].toString(16).padStart(2, "0") +
                                key[2].toString(16).padStart(2, "0") +
                                key[3].toString(16).padStart(2, "0") +
                                key[4].toString(16).padStart(2, "0") +
                                key[5].toString(16).padStart(2, "0");
                            const accX = new Uint16Array(decrypt.slice(15, 17).buffer);
                            const accY = new Uint16Array(decrypt.slice(17, 19).buffer);
                            const accZ = new Uint16Array(decrypt.slice(19, 21).buffer);
                            this._lastRx = {
                                time: buffTime32[0],
                                keyType: decrypt[5],
                                key: strKey,
                                keyCrc: decrypt[12],
                                device: String.fromCharCode(decrypt[4]),
                                state: decrypt[13],
                                k0: Boolean(decrypt[14] & 0x01),
                                k1: Boolean(decrypt[14] & 0x02),
                                k2: Boolean(decrypt[14] & 0x04),
                                k3: Boolean(decrypt[14] & 0x08),
                                accX: accX[0],
                                accY: accY[0],
                                accZ: accZ[0],
                                error: decrypt[21],
                            };
                            this._rxCallBack(this._lastRx);
                        }
                    }
                }
                else
                    this._strRx = "";
            }
        });
    }
    write(p_msg) {
        if (this.isOpen === true) {
            this._serial.write(p_msg);
        }
    }
    get isOpen() {
        return this._serial.isOpen;
    }
}
exports.default = SerialComClass;
