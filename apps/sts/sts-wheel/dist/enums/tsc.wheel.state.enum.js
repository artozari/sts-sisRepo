"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcsStateEnum = void 0;
var TcsStateEnum;
(function (TcsStateEnum) {
    TcsStateEnum[TcsStateEnum["OFF_LINE"] = 0] = "OFF_LINE";
    TcsStateEnum[TcsStateEnum["NOT_BUSY"] = 1] = "NOT_BUSY";
    TcsStateEnum[TcsStateEnum["EMPTY_WHEEL"] = 2] = "EMPTY_WHEEL";
    TcsStateEnum[TcsStateEnum["GOOD_LUCK"] = 3] = "GOOD_LUCK";
    TcsStateEnum[TcsStateEnum["NO_MORE_BETS"] = 4] = "NO_MORE_BETS";
    TcsStateEnum[TcsStateEnum["BALL_PASS"] = 5] = "BALL_PASS";
    TcsStateEnum[TcsStateEnum["WINNING_NUMBER"] = 6] = "WINNING_NUMBER";
})(TcsStateEnum || (exports.TcsStateEnum = TcsStateEnum = {}));
