import { Crc32Class } from "@slcn-pkg/crc-class";
import { SerialPort } from "serialport";
import StsSerialProtocolClass from "../stsSerialProtocol/sts.serial.protocol.class";
import { EffectsLedLightsEnum, StsHardwareMqttRx, StsHardwareMqttTx, StsSemaphoreEnum } from "sts-common";
import { GeneralLoggerClass } from "@slcn-pkg/general-logger-class";
import { LevelsLoggerEnum } from "@slcn-pkg/general-logger-constants";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcd = require("bcd");

export type RxCallBackType = (p_data: StsHardwareMqttRx) => void;

export default class SerialComClass {
  private _values: StsHardwareMqttTx;
  private _lastRx: StsHardwareMqttRx | null = null;
  private readonly stsSerialProtocol: StsSerialProtocolClass = new StsSerialProtocolClass();
  private readonly _serial: SerialPort;
  private _strRx: string;
  private readonly _crc: Crc32Class = new Crc32Class();

  private readonly reOpen = () => {
    if (this.isOpen === false) {
      this._serial.open();
    }
  };

  constructor(
    private readonly _rxCallBack: RxCallBackType,
    private readonly _port: string,
    private readonly _baudRate: number,
    private readonly _dataBits: 5 | 6 | 7 | 8 | undefined,
    private readonly _stopBits: 1 | 1.5 | 2 | undefined,
    private readonly _parity: "none" | "even" | "odd" | "mark" | "space" | undefined,
    private readonly _logger: GeneralLoggerClass
  ) {
    this._values = {
      time: 0,
      key: "",
      keyType: 0,
      semaphore: StsSemaphoreEnum.RED,
      semaphoreLights: 15,
      semaphoreIntensity: 5,
      colorOfLights: EffectsLedLightsEnum.LowRed,
      lightsIntensity: 0,
      SevenSegmentDisplay: 0,
    };

    this._strRx = "";

    this._serial = new SerialPort({
      path: this._port,
      baudRate: this._baudRate,
      dataBits: this._dataBits,
      stopBits: this._stopBits,
      parity: this._parity,
      autoOpen: true,
    });

    const pepa: Uint8Array = new Uint8Array([10, 11, 12, 86, 146, 6, 43]);
    this.checkCrc(pepa);

    setInterval(this.reOpen, 1000);

    this._serial.on("open", () => {
      this._logger.proc(LevelsLoggerEnum.info, `Connection established on port: ${this._port}`);
    });

    this._serial.on("error", function (err) {
      _logger.proc(LevelsLoggerEnum.error, `${err.message}`);
    });

    this._serial.on("data", (data) => {
      const dataRx: string = data.toString();

      for (const charRx of dataRx) {
        if (charRx === "#") this._strRx = "";
        else if ((charRx >= "0" && charRx <= "9") || (charRx >= "A" && charRx <= "F")) this._strRx += charRx;
        else if (charRx === ";") {
          const pepe = this._strRx.match(/[\da-f]{2}/gi);
          if (pepe !== null) {
            const typedArray = new Uint8Array(
              pepe.map(function (h) {
                return parseInt(h, 16);
              })
            );
            const decrypt: Uint8Array = this.decrypt(typedArray);
            const bCheckCrc: boolean = this.checkCrc(decrypt);

            if (bCheckCrc) {
              const buffTime: Uint8Array = decrypt.slice(0, 4);
              const buffTime32: Uint32Array = new Uint32Array(buffTime.buffer);
              const key: Uint8Array = decrypt.slice(6, 12);
              const strKey: string =
                key[0].toString(16).padStart(2, "0") +
                key[1].toString(16).padStart(2, "0") +
                key[2].toString(16).padStart(2, "0") +
                key[3].toString(16).padStart(2, "0") +
                key[4].toString(16).padStart(2, "0") +
                key[5].toString(16).padStart(2, "0");
              const accX: Uint16Array = new Uint16Array(decrypt.slice(15, 17).buffer);
              const accY: Uint16Array = new Uint16Array(decrypt.slice(17, 19).buffer);
              const accZ: Uint16Array = new Uint16Array(decrypt.slice(19, 21).buffer);

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
        } else this._strRx = "";
      }
    });
  }

  public write(p_msg: string) {
    if (this.isOpen === true) {
      this._serial.write(p_msg);
    }
  }

  public get isOpen(): boolean {
    return this._serial.isOpen;
  }

  private readonly checkCrc = (p_buff: Uint8Array): boolean => {
    let resp: boolean = false;

    try {
      if (p_buff.length > 4) {
        const crcRx: Uint8Array = p_buff.slice(p_buff.length - 4);
        p_buff.set([115, 76, 99, 78], p_buff.length - 4);
        const crcCalc: Uint8Array | false = this._crc.calculate(p_buff, p_buff.length);
        if (crcCalc !== false) {
          if (crcCalc.length === crcRx.length) {
            for (let i: number = 0; i < crcRx.length; i++) {
              if (crcCalc[i] !== crcRx[i]) throw new Error();
            }
            resp = true;
          }
        }
      }
    } catch (error) {
      resp = false;
    }

    return resp;
  };

  private readonly generateRespMsg = (
    p_time: Uint8Array,
    p_state: number,
    p_tableNum: number,
    p_lightsIntensity: number,
    p_colorOfLights: EffectsLedLightsEnum,
    p_semaphore: number,
    p_semaphoreLights: number,
  ): string | false => {
    let resp: string | boolean = false;

    try {
      const arrayTime: Uint8Array = p_time;
      const arrayDevice: Uint8Array = new Uint8Array([0x53]);
      const arrayState: Uint8Array = new Uint8Array([p_state]);
      const arrayTable: Uint8Array = new Uint8Array(bcd.encode(p_tableNum));
      const arrayGame: Uint8Array = new Uint8Array([0x00]); //	0; //new Uint8Array(bcd.encode(p_gameNum));
      // const arrayLight: Uint8Array = this.numToUint8Array(<number>p_light, 2);
      const arrayColorOfLights: Uint8Array = this.numToUint8Array(<number>p_colorOfLights, 1);
      const arrayLightsIntensity: Uint8Array = this.numToUint8Array(p_lightsIntensity, 1);
      const arraySemaphore: Uint8Array = this.numToUint8Array(p_semaphore, 1);
      const arraySemaphoreLights: Uint8Array = this.numToUint8Array(p_semaphoreLights, 1);
      const arrayCrc: Uint8Array = this.numToUint8Array(0x4e634c73, 4);

      const bufferTx: Uint8Array = new Uint8Array(17);
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
      const crcCalc: Uint8Array | false = this._crc.calculate(bufferTx, bufferTx.length);
      if (crcCalc !== false) {
        bufferTx.set(crcCalc, 13);
        const encrypt: Uint8Array = this.encrypt(bufferTx);

        resp = "#";
        for (const byte of encrypt) {
          resp = resp + byte.toString(16).padStart(2, "0");
        }
        resp = resp + ";";
      }
    } catch (error) {
      resp = false;
    }

    return resp;
  };

  private readonly numToUint8Array = (p_num: number, p_lenght: number): Uint8Array => {
    const arr = new Uint8Array(p_lenght);

    for (let i = 0; i < p_lenght; i++) {
      arr[i] = p_num % 256;
      p_num = Math.floor(p_num / 256);
    }

    return arr;
  };

  private readonly encrypt = (p_buff: Uint8Array): Uint8Array => {
    const lg: number = p_buff.length;
    const arr = new Uint8Array(lg);

    arr[0] = p_buff[0];
    for (let i = 0; i < lg - 1; i++) {
      arr[i + 1] = p_buff[i] ^ p_buff[i + 1];
    }

    return arr;
  };

  private readonly decrypt = (p_buff: Uint8Array): Uint8Array => {
    const lg: number = p_buff.length;
    const arr = new Uint8Array(lg);

    arr[0] = p_buff[0];
    for (let i = 0; i < lg - 1; i++) {
      arr[i + 1] = arr[i] ^ p_buff[i + 1];
    }

    return arr;
  };

  public setValues = (p_data: StsHardwareMqttTx) => {
    this._values = p_data;

    const arrayTime = new Uint8Array(4);
    let num: number = p_data.time;
    for (let i = 0; i < 4; i++) {
      arrayTime[i] = num % 256;
      num = Math.floor(num / 256);
    }

    const display: number = this._values.SevenSegmentDisplay !== 255 ? this._values.SevenSegmentDisplay : 255;
    const colorOfLights: EffectsLedLightsEnum = this._values.colorOfLights;
    const lightsIntensity: EffectsLedLightsEnum = this._values.lightsIntensity;
    const semaphoreIntensity: number = this._values.semaphoreIntensity;
    const semaphoreLights: number = this._values.semaphoreLights;
    const semaphore: number = (semaphoreIntensity << 4) + this._values.semaphore;
    const strTx: string | false = this.generateRespMsg(arrayTime, 1, display, lightsIntensity, colorOfLights, semaphore, semaphoreLights);

    if (strTx !== false) {
      this.write(strTx);
    }
  };
}
