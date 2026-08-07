"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouletteStateEnum = void 0;
/**
 * Enum representing the possible states of a roulette game.
 */
var RouletteStateEnum;
(function (RouletteStateEnum) {
    RouletteStateEnum[RouletteStateEnum["PLACE_YOUR_BETS"] = 0] = "PLACE_YOUR_BETS";
    RouletteStateEnum[RouletteStateEnum["NO_MORE_BETS"] = 1] = "NO_MORE_BETS";
    RouletteStateEnum[RouletteStateEnum["WINNING_NUMBER"] = 2] = "WINNING_NUMBER";
    RouletteStateEnum[RouletteStateEnum["CLOSE"] = 3] = "CLOSE";
    RouletteStateEnum[RouletteStateEnum["ERROR"] = 4] = "ERROR";
})(RouletteStateEnum || (exports.RouletteStateEnum = RouletteStateEnum = {}));
