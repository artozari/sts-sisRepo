import { ClockWiseEnum, GralWheelStateEnum, GralWheelStateInterface } from "sts-common";
import { TcsStateEnum } from "../enums/tsc.wheel.state.enum";
import { TscWheelStateInterface } from "../interfaces/tsc.wheel.state.interface";

enum CtrlAsciiEnum {
  SOH = 0x01,
  STX = 0x02,
  ETX = 0x03,
  EOT = 0x04,
  ENQ = 0x05,
  ACK = 0x06,
  NAK = 0x15,
  ETB = 0x17,
}

export enum TxTypeEnum {
  POLLING,
  ACK,
  NAK,
}

const TSC_DATA: number = 4;
const TIMER_OFF_LINE_TICK: number = 100;
const TIMER_OFF_LINE_MAX: number = 5000;
const TIMER_OFF_LINE_MAX_TICKs: number = TIMER_OFF_LINE_MAX / TIMER_OFF_LINE_TICK;

export class TcsProtocolClass {
  private _timerOffLine: number;
  private _tcsStat1: TscWheelStateInterface = {} as TscWheelStateInterface;
  private _ptrRxBuff: number = 0;
  private _rxBuff: Uint8Array = new Uint8Array(100);

  constructor(
    private readonly _loggerEnabled: boolean,
    private readonly _callback: (p_state: GralWheelStateInterface) => void
  ) {
    this._timerOffLine = 0;

    this._tcsStat1 = this.loadState(TcsStateEnum.OFF_LINE, TcsStateEnum.OFF_LINE, Date.now(), undefined, undefined, undefined);

    setInterval(this.periodicTicks, TIMER_OFF_LINE_TICK);
    this.periodicTicks();
    setInterval(this.periodicCheckStatus, 1000);
    this.periodicCheckStatus();
  }

  private readonly periodicTicks = (): void => {
    // timer "online"
    if (this._timerOffLine < 0) {
      this._timerOffLine = 0;
    } else if (this._timerOffLine > TIMER_OFF_LINE_MAX_TICKs) {
      if (this._tcsStat1.state !== TcsStateEnum.OFF_LINE) {
        console.log("OFFLINE", new Date().toISOString());
      }
      this._tcsStat1.state = TcsStateEnum.OFF_LINE;
    } else this._timerOffLine += 1;
  };

  private readonly periodicCheckStatus = (): void => {
    if (this._tcsStat1.state !== this._tcsStat1.previousState || this._tcsStat1.state === TcsStateEnum.OFF_LINE) {
      this._tcsStat1.timeState = Date.now();
      this._tcsStat1.previousState = this._tcsStat1.state;
    }

    switch (this._tcsStat1.state) {
      case TcsStateEnum.OFF_LINE:
        break;
      case TcsStateEnum.NOT_BUSY:
        break;
      case TcsStateEnum.WINNING_NUMBER:
        if (Date.now() - this._tcsStat1.timeState > 15000) {
          this._tcsStat1 = this.loadState(TcsStateEnum.NOT_BUSY, this._tcsStat1.state, Date.now(), undefined, undefined, undefined);
          // this._tcsStat1.state = TcsStateEnum.NOT_BUSY;
        }
        break;
      default:
        if (Date.now() - this._tcsStat1.timeState > 30000) {
          this._tcsStat1 = this.loadState(TcsStateEnum.NOT_BUSY, this._tcsStat1.state, Date.now(), undefined, undefined, undefined);
          // this._tcsStat1.state = TcsStateEnum.NOT_BUSY;
        }
        break;
    }

    if (this._tcsStat1.state === TcsStateEnum.OFF_LINE) {
      // empty
    } else if (this._tcsStat1.state === TcsStateEnum.NOT_BUSY) {
      // code empty
    }
    // console.log("periodicCheckStatus ----------------------------------->", this._tcsStat1.state, "---", this._tcsStat1.previousState, "---", (Date.now() - this._tcsStat1.timeState) / 1000);
  };

  private readonly checkLenght = (p_rx: Uint8Array): boolean => {
    let resp: boolean;

    try {
      const RX_MIN: number = 7;
      const RX_MAX: number = 15;
      if (p_rx.length >= RX_MIN && p_rx.length <= RX_MAX) {
        resp = true;
      } else resp = false;
    } catch (error) {
      resp = false;
    }

    return resp;
  };

  private readonly checksum = (p_rx: Uint8Array): boolean => {
    let resp: boolean;

    try {
      if (this.checkLenght(p_rx)) {
        let chksumCalc: number = 0;
        p_rx.forEach((x: number, id: number) => {
          if (id < p_rx.length - 2) chksumCalc += x;
        });
        chksumCalc &= 0x3f;
        chksumCalc |= 0x40;

        const chksumRx: number = p_rx[p_rx.length - 2];

        // console.log("chksum calc --> 0x" + chksumCalc.toString(16));
        // console.log("chksum rx ----> 0x" + chksumRx.toString(16));

        resp = chksumCalc === chksumRx;
      } else resp = false;
    } catch (error) {
      resp = false;
    }

    return resp;
  };

  private readonly verifyFormat = (p_rx: Uint8Array): boolean => {
    let resp: boolean;

    try {
      if (p_rx[0] !== CtrlAsciiEnum.SOH) resp = false;
      else if (p_rx[1] !== 0x30) resp = false;
      else if (p_rx[2] !== 0x32) resp = false;
      else if (p_rx[3] !== CtrlAsciiEnum.STX) resp = false;
      else if (p_rx[p_rx.length - 3] !== CtrlAsciiEnum.ETX) resp = false;
      else if ((p_rx[p_rx.length - 2] & 0xc0) !== 0x40) resp = false;
      else if (p_rx[p_rx.length - 1] !== CtrlAsciiEnum.EOT) resp = false;
      else resp = true;
    } catch (error) {
      resp = false;
    }

    return resp;
  };

  private readonly isClockWise = (p_value: number): boolean => {
    let resp: boolean;
    try {
      if (p_value === 0x30 || p_value === 0x31) resp = true;
      else resp = false;
    } catch (error) {
      resp = false;
    }
    return resp;
  };

  private readonly isAsciiNumber = (p_value: number): number | false => {
    let resp: number | false;
    try {
      if (p_value >= 0x30 && p_value <= 0x39) resp = p_value & 0x0f;
      else resp = false;
    } catch (error) {
      resp = false;
    }
    return resp;
  };

  private readonly isNoData = (p_rx: Uint8Array): boolean => {
    let resp: boolean = false;
    try {
      if (p_rx.length !== 1) {
        // empty
      } else if (p_rx[0] !== CtrlAsciiEnum.ETB) {
        // empty
      } else resp = true;
    } catch (error) {
      resp = false;
    }
    return resp;
  };

  private readonly isNoMoreBets = (p_rx: Uint8Array): boolean => {
    let resp: boolean = false;
    try {
      if (p_rx.length !== 10) {
        // empty
      } else if (this.isAsciiNumber(p_rx[TSC_DATA + 0]) === false) {
        // empty
      } else if (this.isAsciiNumber(p_rx[TSC_DATA + 1]) === false) {
        // empty
      } else if (p_rx[TSC_DATA + 2] !== "N".charCodeAt(0)) {
        // empty
      } else resp = true;
    } catch (error) {
      resp = false;
    }
    return resp;
  };

  private readonly isWinningNumber = (p_rx: Uint8Array): boolean => {
    let resp: boolean = false;
    try {
      if (p_rx.length !== 15) {
        // empty
      } else if (this.isAsciiNumber(p_rx[TSC_DATA + 0]) === false) {
        // empty
      } else if (this.isAsciiNumber(p_rx[TSC_DATA + 1]) === false) {
        // empty
      } else if (p_rx[TSC_DATA + 2] !== "R".charCodeAt(0)) {
        // empty
      } else if (this.isClockWise(p_rx[TSC_DATA + 3]) === false) {
        // empty
      } else if (p_rx[TSC_DATA + 4] !== "D".charCodeAt(0)) {
        // empty
      } else if (this.isAsciiNumber(p_rx[TSC_DATA + 5]) === false) {
        // empty
      } else if (this.isAsciiNumber(p_rx[TSC_DATA + 6]) === false) {
        // empty
      } else if (p_rx[TSC_DATA + 7] !== "V".charCodeAt(0)) {
        // empty
      } else resp = true;
    } catch (error) {
      resp = false;
    }
    return resp;
  };

  private readonly isEmptyWheel = (p_rx: Uint8Array): boolean => {
    let resp: boolean = false;
    try {
      if (p_rx.length !== 8) {
        // empty
      } else if (p_rx[TSC_DATA + 0] !== "E".charCodeAt(0)) {
        // empty
      } else resp = true;
    } catch (error) {
      resp = false;
    }
    return resp;
  };

  private readonly isBallPass = (p_rx: Uint8Array): boolean => {
    let resp: boolean = false;
    try {
      if (p_rx.length !== 9) {
        // empty
      } else if (p_rx[TSC_DATA + 0] !== "S".charCodeAt(0)) {
        // empty
      } else if (this.isAsciiNumber(p_rx[TSC_DATA + 1]) === false) {
        // empty
      } else resp = true;
    } catch (error) {
      resp = false;
    }
    return resp;
  };

  private readonly isGoodLuck = (p_rx: Uint8Array): boolean => {
    let resp: boolean = false;
    try {
      if (p_rx.length !== 8) {
        // empty
      } else if (p_rx[TSC_DATA + 0] !== "G".charCodeAt(0)) {
        // empty
      } else resp = true;
    } catch (error) {
      resp = false;
    }
    return resp;
  };

  private readonly processOnLine = (p_rxOk: boolean): void => {
    try {
      if (p_rxOk === true) {
        this._timerOffLine = 0;
        if (this._tcsStat1.state === TcsStateEnum.OFF_LINE) {
          this._tcsStat1.state = TcsStateEnum.NOT_BUSY;
          console.log("ONLINE", new Date().toISOString());
        }
      }
    } catch (error) {
      // empty
    }
  };

  private readonly processNoData = (): boolean => {
    // console.log("NO_DATA", ",resp ->", true);
    return true;
  };

  private readonly processEmptyWhell = (): boolean => {
    try {
      // this._tcsState = TcsStateEnum.EMPTY_WHEEL;
      this._tcsStat1 = this.loadState(TcsStateEnum.EMPTY_WHEEL, this._tcsStat1.state, Date.now(), undefined, undefined, undefined);
    } catch (error) {
      // empty
    }

    if (this._loggerEnabled) console.log("EMPTY_WHEEL", this._tcsStat1, ",resp ->", true);
    return true;
  };

  private readonly processBallPass = (p_rx: Uint8Array): boolean => {
    let resp: boolean = false;
    let ballPass: number | false = false;

    try {
      // this._tcsState = TcsStateEnum.BALL_PASS;

      ballPass = this.isAsciiNumber(p_rx[1]);
      if (ballPass !== false) {
        this._tcsStat1 = this.loadState(TcsStateEnum.BALL_PASS, this._tcsStat1.previousState, Date.now(), undefined, undefined, undefined);
        resp = true;
      }
    } catch (error) {
      resp = false;
    }

    if (this._loggerEnabled) console.log("BALL_PASS ->", ballPass, this._tcsStat1, ",resp ->", resp);
    return resp;
  };

  private readonly processGoodLuck = (): boolean => {
    try {
      // this._tcsState = TcsStateEnum.GOOD_LUCK;
      this._tcsStat1 = this.loadState(TcsStateEnum.GOOD_LUCK, this._tcsStat1.previousState, Date.now(), undefined, undefined, undefined);
    } catch (error) {
      // empty
    }

    if (this._loggerEnabled) console.log("GOOD_LUCK", this._tcsStat1, ",resp ->", true);
    return true;
  };

  private readonly processNoMoreBets = (): boolean => {
    try {
      this._tcsStat1 = this.loadState(TcsStateEnum.NO_MORE_BETS, this._tcsStat1.previousState, Date.now(), undefined, undefined, undefined);
      // this._tcsState = TcsStateEnum.NO_MORE_BETS;
    } catch (error) {
      // empty
    }

    if (this._loggerEnabled) console.log("NO_MORE_BETS", this._tcsStat1, ",resp ->", true);
    return true;
  };

  private readonly processWinningNumber = (p_rx: Uint8Array): boolean => {
    let resp: boolean = false;
    let num: number | false = false;
    let speed: number | false = false;
    let clockWise: ClockWiseEnum | undefined = undefined;

    try {
      let numH, numL: number | false;

      numH = this.isAsciiNumber(p_rx[0]);
      numL = this.isAsciiNumber(p_rx[1]);
      if (numH !== false && numL !== false) {
        num = numH * 10 + numL;
      }

      numL = this.isAsciiNumber(p_rx[3]);
      if (numL !== false) {
        if (numL === 1) clockWise = ClockWiseEnum.ClockWise;
        else if (numL === 0) clockWise = ClockWiseEnum.AntiClockWise;
        else clockWise = undefined;
      } else clockWise = undefined;

      numH = this.isAsciiNumber(p_rx[5]);
      numL = this.isAsciiNumber(p_rx[6]);
      if (numH !== false && numL !== false) {
        speed = numH * 10 + numL;
      }

      // this._tcsState = TcsStateEnum.WINNING_NUMBER;

      if (num !== false && clockWise !== undefined && speed !== false) {
        this._tcsStat1 = this.loadState(TcsStateEnum.WINNING_NUMBER, this._tcsStat1.previousState, Date.now(), clockWise, num, speed);
        resp = true;
      }
    } catch (error) {
      resp = false;
    }

    if (this._loggerEnabled) console.log("WINNING_NUMBER ->", num, clockWise, speed, this._tcsStat1, ",resp ->", resp);
    return resp;
  };

  private readonly procRx = (p_rx: Uint8Array, p_length: number): boolean => {
    let response: boolean;

    try {
      const buffRx: Uint8Array = p_rx.subarray(0, p_length);

      if (this.isNoData(buffRx) === true) response = this.processNoData();
      else if (this.checkLenght(buffRx) === false) response = false;
      else if (this.verifyFormat(buffRx) === false) response = false;
      else if (this.checksum(buffRx) === false) response = false;
      else if (this.isEmptyWheel(buffRx) === true) response = this.processEmptyWhell();
      else if (this.isBallPass(buffRx) === true) response = this.processBallPass(buffRx.subarray(TSC_DATA, TSC_DATA + 2));
      else if (this.isGoodLuck(buffRx) === true) response = this.processGoodLuck();
      else if (this.isNoMoreBets(buffRx) === true) response = this.processNoMoreBets();
      else if (this.isWinningNumber(buffRx) === true) response = this.processWinningNumber(buffRx.subarray(TSC_DATA, TSC_DATA + 8));
      else response = false;

      this.processOnLine(response);

      this.transformState(this._tcsStat1);
    } catch (error) {
      response = false;
    }

    return response;
  };

  private readonly clearRxBuff = (): void => {
    this._rxBuff.fill(0);
    this._ptrRxBuff = 0;
  };

  public rx = (p_rx: Uint8Array): boolean => {
    let resp: boolean = false;

    try {
      for (let i: number = 0; i < p_rx.length; i++) {
        const byte: number = p_rx[i];
        if (this._ptrRxBuff >= this._rxBuff.length) this.clearRxBuff();
        else if (byte === CtrlAsciiEnum.SOH) {
          this._rxBuff[0] = byte;
          this._ptrRxBuff = 1;
        } else if (byte === CtrlAsciiEnum.EOT) {
          this._rxBuff[this._ptrRxBuff] = byte;
          this._ptrRxBuff += 1;
          resp = this.procRx(this._rxBuff, this._ptrRxBuff);
        } else {
          this._rxBuff[this._ptrRxBuff] = byte;
          this._ptrRxBuff += 1;
        }

        if (this._ptrRxBuff === 1) resp = this.procRx(this._rxBuff, this._ptrRxBuff);

        if (resp === true) this.clearRxBuff();
      }
    } catch (error) {
      resp = false;
    }

    // console.log("rxBuff ----->", this._rxBuff.subarray(0, this._ptrRxBuff), this._ptrRxBuff);
    return resp;
  };

  public tx = (p_typeTx: TxTypeEnum): false | Uint8Array => {
    let resp: false | Uint8Array;

    try {
      // clear the RX buffer
      // this.clearRxBuff();

      switch (p_typeTx) {
        case TxTypeEnum.POLLING:
          resp = new Uint8Array([CtrlAsciiEnum.ENQ, 0x30, 0x32, CtrlAsciiEnum.EOT]);
          break;
        case TxTypeEnum.ACK:
          resp = new Uint8Array([CtrlAsciiEnum.SOH, 0x30, 0x32, CtrlAsciiEnum.ACK]);
          break;
        case TxTypeEnum.NAK:
          resp = new Uint8Array([CtrlAsciiEnum.SOH, 0x30, 0x32, CtrlAsciiEnum.NAK]);
          break;
        default:
          resp = false;
      }
    } catch (error) {
      resp = false;
    }

    return resp;
  };

  private readonly loadState = (
    p_state: TcsStateEnum,
    p_previousState: TcsStateEnum,
    p_timeState: number,
    p_clockWise: ClockWiseEnum | undefined,
    p_winningNumber: number | undefined,
    p_speed: number | undefined
  ): TscWheelStateInterface => {
    const state: TscWheelStateInterface = {} as TscWheelStateInterface;
    try {
      state.state = p_state;
      state.previousState = p_previousState;
      state.timeState = p_timeState;
      state.winningNumber = p_winningNumber;
      state.clockWise = p_clockWise;
      state.speed = p_speed;
    } catch (error) {
      state.state = TcsStateEnum.OFF_LINE;
      state.previousState = TcsStateEnum.OFF_LINE;
      state.timeState = 0;
      state.winningNumber = undefined;
      state.clockWise = undefined;
      state.speed = undefined;
    }

    return state;
  };

  private transformState(p_tcsState: TscWheelStateInterface): void {
    const gralState: GralWheelStateInterface = {} as GralWheelStateInterface;

    try {
      //transform state
      if (p_tcsState.state === TcsStateEnum.OFF_LINE) gralState.state = GralWheelStateEnum.OFF_LINE;
      else if (p_tcsState.state === TcsStateEnum.NOT_BUSY) gralState.state = GralWheelStateEnum.PLACE_YOUR_BETS;
      else if (p_tcsState.state === TcsStateEnum.EMPTY_WHEEL) gralState.state = GralWheelStateEnum.PLACE_YOUR_BETS;
      else if (p_tcsState.state === TcsStateEnum.GOOD_LUCK) gralState.state = GralWheelStateEnum.NO_MORE_BETS;
      else if (p_tcsState.state === TcsStateEnum.NO_MORE_BETS) gralState.state = GralWheelStateEnum.NO_MORE_BETS;
      else if (p_tcsState.state === TcsStateEnum.BALL_PASS) gralState.state = GralWheelStateEnum.NO_MORE_BETS;
      else if (p_tcsState.state === TcsStateEnum.WINNING_NUMBER) gralState.state = GralWheelStateEnum.WINNING_NUMBER;
      else gralState.state = GralWheelStateEnum.OFF_LINE;

      // fill the general state
      gralState.timeState = Math.round((Date.now() - p_tcsState.timeState) / 1000);
      gralState.winningNumber = p_tcsState.winningNumber;
      gralState.clockWise = p_tcsState.clockWise;
      gralState.speed = p_tcsState.speed;
      this._callback(gralState);
    } catch (error) {
      // empty
    }
  }
}
