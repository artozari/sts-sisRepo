"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcsProtocolClass = exports.TxTypeEnum = void 0;
const sts_common_1 = require("sts-common");
const tsc_wheel_state_enum_1 = require("../enums/tsc.wheel.state.enum");
var CtrlAsciiEnum;
(function (CtrlAsciiEnum) {
    CtrlAsciiEnum[CtrlAsciiEnum["SOH"] = 1] = "SOH";
    CtrlAsciiEnum[CtrlAsciiEnum["STX"] = 2] = "STX";
    CtrlAsciiEnum[CtrlAsciiEnum["ETX"] = 3] = "ETX";
    CtrlAsciiEnum[CtrlAsciiEnum["EOT"] = 4] = "EOT";
    CtrlAsciiEnum[CtrlAsciiEnum["ENQ"] = 5] = "ENQ";
    CtrlAsciiEnum[CtrlAsciiEnum["ACK"] = 6] = "ACK";
    CtrlAsciiEnum[CtrlAsciiEnum["NAK"] = 21] = "NAK";
    CtrlAsciiEnum[CtrlAsciiEnum["ETB"] = 23] = "ETB";
})(CtrlAsciiEnum || (CtrlAsciiEnum = {}));
var TxTypeEnum;
(function (TxTypeEnum) {
    TxTypeEnum[TxTypeEnum["POLLING"] = 0] = "POLLING";
    TxTypeEnum[TxTypeEnum["ACK"] = 1] = "ACK";
    TxTypeEnum[TxTypeEnum["NAK"] = 2] = "NAK";
})(TxTypeEnum || (exports.TxTypeEnum = TxTypeEnum = {}));
const TSC_DATA = 4;
const TIMER_OFF_LINE_TICK = 100;
const TIMER_OFF_LINE_MAX = 5000;
const TIMER_OFF_LINE_MAX_TICKs = TIMER_OFF_LINE_MAX / TIMER_OFF_LINE_TICK;
class TcsProtocolClass {
    constructor(_loggerEnabled, _callback) {
        this._loggerEnabled = _loggerEnabled;
        this._callback = _callback;
        this._tcsStat1 = {};
        this._ptrRxBuff = 0;
        this._rxBuff = new Uint8Array(100);
        this.periodicTicks = () => {
            // timer "online"
            if (this._timerOffLine < 0) {
                this._timerOffLine = 0;
            }
            else if (this._timerOffLine > TIMER_OFF_LINE_MAX_TICKs) {
                if (this._tcsStat1.state !== tsc_wheel_state_enum_1.TcsStateEnum.OFF_LINE) {
                    console.log("OFFLINE", new Date().toISOString());
                }
                this._tcsStat1.state = tsc_wheel_state_enum_1.TcsStateEnum.OFF_LINE;
            }
            else
                this._timerOffLine += 1;
        };
        this.periodicCheckStatus = () => {
            if (this._tcsStat1.state !== this._tcsStat1.previousState || this._tcsStat1.state === tsc_wheel_state_enum_1.TcsStateEnum.OFF_LINE) {
                this._tcsStat1.timeState = Date.now();
                this._tcsStat1.previousState = this._tcsStat1.state;
            }
            switch (this._tcsStat1.state) {
                case tsc_wheel_state_enum_1.TcsStateEnum.OFF_LINE:
                    break;
                case tsc_wheel_state_enum_1.TcsStateEnum.NOT_BUSY:
                    break;
                case tsc_wheel_state_enum_1.TcsStateEnum.WINNING_NUMBER:
                    if (Date.now() - this._tcsStat1.timeState > 15000) {
                        this._tcsStat1 = this.loadState(tsc_wheel_state_enum_1.TcsStateEnum.NOT_BUSY, this._tcsStat1.state, Date.now(), undefined, undefined, undefined);
                        // this._tcsStat1.state = TcsStateEnum.NOT_BUSY;
                    }
                    break;
                default:
                    if (Date.now() - this._tcsStat1.timeState > 30000) {
                        this._tcsStat1 = this.loadState(tsc_wheel_state_enum_1.TcsStateEnum.NOT_BUSY, this._tcsStat1.state, Date.now(), undefined, undefined, undefined);
                        // this._tcsStat1.state = TcsStateEnum.NOT_BUSY;
                    }
                    break;
            }
            if (this._tcsStat1.state === tsc_wheel_state_enum_1.TcsStateEnum.OFF_LINE) {
                // empty
            }
            else if (this._tcsStat1.state === tsc_wheel_state_enum_1.TcsStateEnum.NOT_BUSY) {
                // code empty
            }
            // console.log("periodicCheckStatus ----------------------------------->", this._tcsStat1.state, "---", this._tcsStat1.previousState, "---", (Date.now() - this._tcsStat1.timeState) / 1000);
        };
        this.checkLenght = (p_rx) => {
            let resp;
            try {
                const RX_MIN = 7;
                const RX_MAX = 15;
                if (p_rx.length >= RX_MIN && p_rx.length <= RX_MAX) {
                    resp = true;
                }
                else
                    resp = false;
            }
            catch (error) {
                resp = false;
            }
            return resp;
        };
        this.checksum = (p_rx) => {
            let resp;
            try {
                if (this.checkLenght(p_rx)) {
                    let chksumCalc = 0;
                    p_rx.forEach((x, id) => {
                        if (id < p_rx.length - 2)
                            chksumCalc += x;
                    });
                    chksumCalc &= 0x3f;
                    chksumCalc |= 0x40;
                    const chksumRx = p_rx[p_rx.length - 2];
                    // console.log("chksum calc --> 0x" + chksumCalc.toString(16));
                    // console.log("chksum rx ----> 0x" + chksumRx.toString(16));
                    resp = chksumCalc === chksumRx;
                }
                else
                    resp = false;
            }
            catch (error) {
                resp = false;
            }
            return resp;
        };
        this.verifyFormat = (p_rx) => {
            let resp;
            try {
                if (p_rx[0] !== CtrlAsciiEnum.SOH)
                    resp = false;
                else if (p_rx[1] !== 0x30)
                    resp = false;
                else if (p_rx[2] !== 0x32)
                    resp = false;
                else if (p_rx[3] !== CtrlAsciiEnum.STX)
                    resp = false;
                else if (p_rx[p_rx.length - 3] !== CtrlAsciiEnum.ETX)
                    resp = false;
                else if ((p_rx[p_rx.length - 2] & 0xc0) !== 0x40)
                    resp = false;
                else if (p_rx[p_rx.length - 1] !== CtrlAsciiEnum.EOT)
                    resp = false;
                else
                    resp = true;
            }
            catch (error) {
                resp = false;
            }
            return resp;
        };
        this.isClockWise = (p_value) => {
            let resp;
            try {
                if (p_value === 0x30 || p_value === 0x31)
                    resp = true;
                else
                    resp = false;
            }
            catch (error) {
                resp = false;
            }
            return resp;
        };
        this.isAsciiNumber = (p_value) => {
            let resp;
            try {
                if (p_value >= 0x30 && p_value <= 0x39)
                    resp = p_value & 0x0f;
                else
                    resp = false;
            }
            catch (error) {
                resp = false;
            }
            return resp;
        };
        this.isNoData = (p_rx) => {
            let resp = false;
            try {
                if (p_rx.length !== 1) {
                    // empty
                }
                else if (p_rx[0] !== CtrlAsciiEnum.ETB) {
                    // empty
                }
                else
                    resp = true;
            }
            catch (error) {
                resp = false;
            }
            return resp;
        };
        this.isNoMoreBets = (p_rx) => {
            let resp = false;
            try {
                if (p_rx.length !== 10) {
                    // empty
                }
                else if (this.isAsciiNumber(p_rx[TSC_DATA + 0]) === false) {
                    // empty
                }
                else if (this.isAsciiNumber(p_rx[TSC_DATA + 1]) === false) {
                    // empty
                }
                else if (p_rx[TSC_DATA + 2] !== "N".charCodeAt(0)) {
                    // empty
                }
                else
                    resp = true;
            }
            catch (error) {
                resp = false;
            }
            return resp;
        };
        this.isWinningNumber = (p_rx) => {
            let resp = false;
            try {
                if (p_rx.length !== 15) {
                    // empty
                }
                else if (this.isAsciiNumber(p_rx[TSC_DATA + 0]) === false) {
                    // empty
                }
                else if (this.isAsciiNumber(p_rx[TSC_DATA + 1]) === false) {
                    // empty
                }
                else if (p_rx[TSC_DATA + 2] !== "R".charCodeAt(0)) {
                    // empty
                }
                else if (this.isClockWise(p_rx[TSC_DATA + 3]) === false) {
                    // empty
                }
                else if (p_rx[TSC_DATA + 4] !== "D".charCodeAt(0)) {
                    // empty
                }
                else if (this.isAsciiNumber(p_rx[TSC_DATA + 5]) === false) {
                    // empty
                }
                else if (this.isAsciiNumber(p_rx[TSC_DATA + 6]) === false) {
                    // empty
                }
                else if (p_rx[TSC_DATA + 7] !== "V".charCodeAt(0)) {
                    // empty
                }
                else
                    resp = true;
            }
            catch (error) {
                resp = false;
            }
            return resp;
        };
        this.isEmptyWheel = (p_rx) => {
            let resp = false;
            try {
                if (p_rx.length !== 8) {
                    // empty
                }
                else if (p_rx[TSC_DATA + 0] !== "E".charCodeAt(0)) {
                    // empty
                }
                else
                    resp = true;
            }
            catch (error) {
                resp = false;
            }
            return resp;
        };
        this.isBallPass = (p_rx) => {
            let resp = false;
            try {
                if (p_rx.length !== 9) {
                    // empty
                }
                else if (p_rx[TSC_DATA + 0] !== "S".charCodeAt(0)) {
                    // empty
                }
                else if (this.isAsciiNumber(p_rx[TSC_DATA + 1]) === false) {
                    // empty
                }
                else
                    resp = true;
            }
            catch (error) {
                resp = false;
            }
            return resp;
        };
        this.isGoodLuck = (p_rx) => {
            let resp = false;
            try {
                if (p_rx.length !== 8) {
                    // empty
                }
                else if (p_rx[TSC_DATA + 0] !== "G".charCodeAt(0)) {
                    // empty
                }
                else
                    resp = true;
            }
            catch (error) {
                resp = false;
            }
            return resp;
        };
        this.processOnLine = (p_rxOk) => {
            try {
                if (p_rxOk === true) {
                    this._timerOffLine = 0;
                    if (this._tcsStat1.state === tsc_wheel_state_enum_1.TcsStateEnum.OFF_LINE) {
                        this._tcsStat1.state = tsc_wheel_state_enum_1.TcsStateEnum.NOT_BUSY;
                        console.log("ONLINE", new Date().toISOString());
                    }
                }
            }
            catch (error) {
                // empty
            }
        };
        this.processNoData = () => {
            // console.log("NO_DATA", ",resp ->", true);
            return true;
        };
        this.processEmptyWhell = () => {
            try {
                // this._tcsState = TcsStateEnum.EMPTY_WHEEL;
                this._tcsStat1 = this.loadState(tsc_wheel_state_enum_1.TcsStateEnum.EMPTY_WHEEL, this._tcsStat1.state, Date.now(), undefined, undefined, undefined);
            }
            catch (error) {
                // empty
            }
            if (this._loggerEnabled)
                console.log("EMPTY_WHEEL", this._tcsStat1, ",resp ->", true);
            return true;
        };
        this.processBallPass = (p_rx) => {
            let resp = false;
            let ballPass = false;
            try {
                // this._tcsState = TcsStateEnum.BALL_PASS;
                ballPass = this.isAsciiNumber(p_rx[1]);
                if (ballPass !== false) {
                    this._tcsStat1 = this.loadState(tsc_wheel_state_enum_1.TcsStateEnum.BALL_PASS, this._tcsStat1.previousState, Date.now(), undefined, undefined, undefined);
                    resp = true;
                }
            }
            catch (error) {
                resp = false;
            }
            if (this._loggerEnabled)
                console.log("BALL_PASS ->", ballPass, this._tcsStat1, ",resp ->", resp);
            return resp;
        };
        this.processGoodLuck = () => {
            try {
                // this._tcsState = TcsStateEnum.GOOD_LUCK;
                this._tcsStat1 = this.loadState(tsc_wheel_state_enum_1.TcsStateEnum.GOOD_LUCK, this._tcsStat1.previousState, Date.now(), undefined, undefined, undefined);
            }
            catch (error) {
                // empty
            }
            if (this._loggerEnabled)
                console.log("GOOD_LUCK", this._tcsStat1, ",resp ->", true);
            return true;
        };
        this.processNoMoreBets = () => {
            try {
                this._tcsStat1 = this.loadState(tsc_wheel_state_enum_1.TcsStateEnum.NO_MORE_BETS, this._tcsStat1.previousState, Date.now(), undefined, undefined, undefined);
                // this._tcsState = TcsStateEnum.NO_MORE_BETS;
            }
            catch (error) {
                // empty
            }
            if (this._loggerEnabled)
                console.log("NO_MORE_BETS", this._tcsStat1, ",resp ->", true);
            return true;
        };
        this.processWinningNumber = (p_rx) => {
            let resp = false;
            let num = false;
            let speed = false;
            let clockWise = undefined;
            try {
                let numH, numL;
                numH = this.isAsciiNumber(p_rx[0]);
                numL = this.isAsciiNumber(p_rx[1]);
                if (numH !== false && numL !== false) {
                    num = numH * 10 + numL;
                }
                numL = this.isAsciiNumber(p_rx[3]);
                if (numL !== false) {
                    if (numL === 1)
                        clockWise = sts_common_1.ClockWiseEnum.ClockWise;
                    else if (numL === 0)
                        clockWise = sts_common_1.ClockWiseEnum.AntiClockWise;
                    else
                        clockWise = undefined;
                }
                else
                    clockWise = undefined;
                numH = this.isAsciiNumber(p_rx[5]);
                numL = this.isAsciiNumber(p_rx[6]);
                if (numH !== false && numL !== false) {
                    speed = numH * 10 + numL;
                }
                // this._tcsState = TcsStateEnum.WINNING_NUMBER;
                if (num !== false && clockWise !== undefined && speed !== false) {
                    this._tcsStat1 = this.loadState(tsc_wheel_state_enum_1.TcsStateEnum.WINNING_NUMBER, this._tcsStat1.previousState, Date.now(), clockWise, num, speed);
                    resp = true;
                }
            }
            catch (error) {
                resp = false;
            }
            if (this._loggerEnabled)
                console.log("WINNING_NUMBER ->", num, clockWise, speed, this._tcsStat1, ",resp ->", resp);
            return resp;
        };
        this.procRx = (p_rx, p_length) => {
            let response;
            try {
                const buffRx = p_rx.subarray(0, p_length);
                if (this.isNoData(buffRx) === true)
                    response = this.processNoData();
                else if (this.checkLenght(buffRx) === false)
                    response = false;
                else if (this.verifyFormat(buffRx) === false)
                    response = false;
                else if (this.checksum(buffRx) === false)
                    response = false;
                else if (this.isEmptyWheel(buffRx) === true)
                    response = this.processEmptyWhell();
                else if (this.isBallPass(buffRx) === true)
                    response = this.processBallPass(buffRx.subarray(TSC_DATA, TSC_DATA + 2));
                else if (this.isGoodLuck(buffRx) === true)
                    response = this.processGoodLuck();
                else if (this.isNoMoreBets(buffRx) === true)
                    response = this.processNoMoreBets();
                else if (this.isWinningNumber(buffRx) === true)
                    response = this.processWinningNumber(buffRx.subarray(TSC_DATA, TSC_DATA + 8));
                else
                    response = false;
                this.processOnLine(response);
                this.transformState(this._tcsStat1);
            }
            catch (error) {
                response = false;
            }
            return response;
        };
        this.clearRxBuff = () => {
            this._rxBuff.fill(0);
            this._ptrRxBuff = 0;
        };
        this.rx = (p_rx) => {
            let resp = false;
            try {
                for (let i = 0; i < p_rx.length; i++) {
                    const byte = p_rx[i];
                    if (this._ptrRxBuff >= this._rxBuff.length)
                        this.clearRxBuff();
                    else if (byte === CtrlAsciiEnum.SOH) {
                        this._rxBuff[0] = byte;
                        this._ptrRxBuff = 1;
                    }
                    else if (byte === CtrlAsciiEnum.EOT) {
                        this._rxBuff[this._ptrRxBuff] = byte;
                        this._ptrRxBuff += 1;
                        resp = this.procRx(this._rxBuff, this._ptrRxBuff);
                    }
                    else {
                        this._rxBuff[this._ptrRxBuff] = byte;
                        this._ptrRxBuff += 1;
                    }
                    if (this._ptrRxBuff === 1)
                        resp = this.procRx(this._rxBuff, this._ptrRxBuff);
                    if (resp === true)
                        this.clearRxBuff();
                }
            }
            catch (error) {
                resp = false;
            }
            // console.log("rxBuff ----->", this._rxBuff.subarray(0, this._ptrRxBuff), this._ptrRxBuff);
            return resp;
        };
        this.tx = (p_typeTx) => {
            let resp;
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
            }
            catch (error) {
                resp = false;
            }
            return resp;
        };
        this.loadState = (p_state, p_previousState, p_timeState, p_clockWise, p_winningNumber, p_speed) => {
            const state = {};
            try {
                state.state = p_state;
                state.previousState = p_previousState;
                state.timeState = p_timeState;
                state.winningNumber = p_winningNumber;
                state.clockWise = p_clockWise;
                state.speed = p_speed;
            }
            catch (error) {
                state.state = tsc_wheel_state_enum_1.TcsStateEnum.OFF_LINE;
                state.previousState = tsc_wheel_state_enum_1.TcsStateEnum.OFF_LINE;
                state.timeState = 0;
                state.winningNumber = undefined;
                state.clockWise = undefined;
                state.speed = undefined;
            }
            return state;
        };
        this._timerOffLine = 0;
        this._tcsStat1 = this.loadState(tsc_wheel_state_enum_1.TcsStateEnum.OFF_LINE, tsc_wheel_state_enum_1.TcsStateEnum.OFF_LINE, Date.now(), undefined, undefined, undefined);
        setInterval(this.periodicTicks, TIMER_OFF_LINE_TICK);
        this.periodicTicks();
        setInterval(this.periodicCheckStatus, 1000);
        this.periodicCheckStatus();
    }
    transformState(p_tcsState) {
        const gralState = {};
        try {
            //transform state
            if (p_tcsState.state === tsc_wheel_state_enum_1.TcsStateEnum.OFF_LINE)
                gralState.state = sts_common_1.GralWheelStateEnum.OFF_LINE;
            else if (p_tcsState.state === tsc_wheel_state_enum_1.TcsStateEnum.NOT_BUSY)
                gralState.state = sts_common_1.GralWheelStateEnum.PLACE_YOUR_BETS;
            else if (p_tcsState.state === tsc_wheel_state_enum_1.TcsStateEnum.EMPTY_WHEEL)
                gralState.state = sts_common_1.GralWheelStateEnum.PLACE_YOUR_BETS;
            else if (p_tcsState.state === tsc_wheel_state_enum_1.TcsStateEnum.GOOD_LUCK)
                gralState.state = sts_common_1.GralWheelStateEnum.NO_MORE_BETS;
            else if (p_tcsState.state === tsc_wheel_state_enum_1.TcsStateEnum.NO_MORE_BETS)
                gralState.state = sts_common_1.GralWheelStateEnum.NO_MORE_BETS;
            else if (p_tcsState.state === tsc_wheel_state_enum_1.TcsStateEnum.BALL_PASS)
                gralState.state = sts_common_1.GralWheelStateEnum.NO_MORE_BETS;
            else if (p_tcsState.state === tsc_wheel_state_enum_1.TcsStateEnum.WINNING_NUMBER)
                gralState.state = sts_common_1.GralWheelStateEnum.WINNING_NUMBER;
            else
                gralState.state = sts_common_1.GralWheelStateEnum.OFF_LINE;
            // fill the general state
            gralState.timeState = Math.round((Date.now() - p_tcsState.timeState) / 1000);
            gralState.winningNumber = p_tcsState.winningNumber;
            gralState.clockWise = p_tcsState.clockWise;
            gralState.speed = p_tcsState.speed;
            this._callback(gralState);
        }
        catch (error) {
            // empty
        }
    }
}
exports.TcsProtocolClass = TcsProtocolClass;
