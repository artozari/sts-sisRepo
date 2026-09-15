"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WheelTcsClass = void 0;
const sts_common_1 = require("sts-common");
const general_logger_constants_1 = require("@slcn-pkg/general-logger-constants");
const TIME_OUT = 5000;
class WheelTcsClass {
    constructor(_LOGS) {
        this._LOGS = _LOGS;
        this.setOffLine = () => {
            this._wheelState.state = sts_common_1.GralWheelStateEnum.OFF_LINE;
            this._wheelState.timeState = 0;
            this._wheelState.winningNumber = undefined;
            this._wheelState.clockWise = undefined;
            this._wheelState.speed = undefined;
            this._wheelState.time = 0;
        };
        this.setOnLine = (p_state) => {
            if (this._wheelState.time === 0 || this._wheelState === undefined)
                this.activateOnLine();
            this._wheelState = p_state;
            this._wheelState.time = Date.now();
        };
        /**
         * Checks if the table is online.
         * If the table has been offline for more than 5 seconds, it activates the offline mode and sets the table as offline.
         */
        this.checkOnLine = () => {
            const deltaT = Date.now() - this._wheelState.time;
            if (deltaT > TIME_OUT) {
                if (this._wheelState.time !== 0)
                    this.activateOffLine();
                this.setOffLine();
            }
        };
        /**
         * Activate the offline mode of the roulette wheel.
         */
        this.activateOffLine = () => {
            this.setOffLine();
            this.log(general_logger_constants_1.LevelsLoggerEnum.emerg, "WHELL OFF LINE");
        };
        /**
         * Activate the online mode of the roulette wheel.
         */ this.activateOnLine = () => {
            this.log(general_logger_constants_1.LevelsLoggerEnum.info, "WHELL ON LINE");
        };
        /**
         * Handles the change of state in the table.
         *
         * @param p_lastState - The previous state of the table.
         * @param p_dataRx - The received data containing the new state.
         */
        this.procChangeState = (p_lastState, p_dataRx) => {
            let change;
            let state;
            try {
                if (p_lastState !== this._wheelState.state) {
                    change = true;
                    state = this._wheelState.state;
                    let strMetaData = "";
                    if (p_lastState === 1 && p_dataRx.state === 2) {
                        strMetaData = " ||| " + new Date().toISOString();
                    }
                    const lastState = this.strGralWheelStateEnum(p_lastState);
                    const nextState = this.strGralWheelStateEnum(p_dataRx.state);
                    this.log(general_logger_constants_1.LevelsLoggerEnum.info, `STATE: ${lastState} --> ${nextState}${strMetaData}`);
                    switch (p_dataRx.state) {
                        case sts_common_1.GralWheelStateEnum.OFF_LINE:
                            this.activateOffLine();
                            break;
                        case sts_common_1.GralWheelStateEnum.PLACE_YOUR_BETS:
                            break;
                        case sts_common_1.GralWheelStateEnum.NO_MORE_BETS:
                            break;
                        case sts_common_1.GralWheelStateEnum.WINNING_NUMBER:
                            break;
                        default:
                            this.activateOffLine();
                            break;
                    }
                }
                else {
                    change = false;
                    state =
                        this._wheelState.state < sts_common_1.GralWheelStateEnum.MAX && this._wheelState.state >= 0
                            ? this._wheelState.state
                            : sts_common_1.GralWheelStateEnum.OFF_LINE;
                }
            }
            catch (error) {
                change = false;
                state = sts_common_1.GralWheelStateEnum.OFF_LINE;
            }
            const resp = { state, change };
            return resp;
        };
        /**
         * Processes the received data from the sts-wheel service.
         *
         * @param p_dataRx - The received data from the sts-wheel service.
         */
        this.procRxWheel = (p_dataRx) => {
            let resp;
            try {
                const lastState = this._wheelState.state;
                this.setOnLine(p_dataRx);
                resp = this.procChangeState(lastState, p_dataRx);
            }
            catch (error) {
                resp = { state: sts_common_1.GralWheelStateEnum.OFF_LINE, change: false };
            }
            return resp;
        };
        this.isOnLine = () => {
            return this._wheelState.state !== sts_common_1.GralWheelStateEnum.OFF_LINE;
        };
        this.getWheelState = () => {
            return this._wheelState.state;
        };
        this.getWheelWinningNumber = () => {
            return this._wheelState.winningNumber;
        };
        this.log = (p_level, p_msg) => {
            if (this._LOGS !== null)
                this._LOGS.proc(p_level, p_msg);
        };
        this.strGralWheelStateEnum = (e) => {
            try {
                const strEnums = Object.keys(sts_common_1.GralWheelStateEnum)[e + sts_common_1.GralWheelStateEnum.MAX + 1];
                return strEnums;
            }
            catch (error) {
                return e.toString();
            }
        };
        this._wheelState = {};
        this.activateOffLine();
        setInterval(this.checkOnLine, 500);
    }
}
exports.WheelTcsClass = WheelTcsClass;
