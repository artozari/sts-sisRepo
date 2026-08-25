"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouletteStateClass = void 0;
const sts_common_1 = require("sts-common");
const roulette_state_enum_1 = require("./roulette.state.enum");
/**
 * Class representing the state of a roulette table.
 *
 * The class allows for setting and retrieving the state of the table based on the wheel state and the open table flag.
 */
class RouletteStateClass {
    /**
     * Initializes a new instance of the RouletteStateClass.
     *
     * Sets the initial state of the table, open table flag, and wheel state.
     */
    constructor() {
        /**
         * Sets the state of the roulette table based on the provided wheel state and the open table flag.
         *
         * @param {GralWheelStateEnum} p_wheelState - The state of the wheel to set the table state from.
         * @return {RouletteStateEnum} The state of the table after setting it based on the provided wheel state and the open table flag.
         */
        this.setTableState = (p_wheelState) => {
            let resp;
            // save the current wheel state
            this._wheelState = p_wheelState;
            try {
                // if the table is not open, set the state to CLOSE
                if (this._openTable === false) {
                    resp = roulette_state_enum_1.RouletteStateEnum.CLOSE;
                }
                else if (this._wheelState === sts_common_1.GralWheelStateEnum.NO_MORE_BETS) {
                    // if the wheel is in the NO_MORE_BETS state, set the table state to NO_MORE_BETS
                    resp = roulette_state_enum_1.RouletteStateEnum.NO_MORE_BETS;
                }
                else if (this._wheelState === sts_common_1.GralWheelStateEnum.WINNING_NUMBER) {
                    // if the wheel is in the NO_MORE_BETS state, set the table state to NO_MORE_BETS
                    resp = roulette_state_enum_1.RouletteStateEnum.WINNING_NUMBER;
                }
                else {
                    // if the wheel is in any other state, set the table state to PLACE_YOUR_BETS
                    resp = roulette_state_enum_1.RouletteStateEnum.PLACE_YOUR_BETS;
                }
            }
            catch (error) {
                // if there is an error, set the table state to ERROR
                resp = roulette_state_enum_1.RouletteStateEnum.ERROR;
            }
            // save the table state
            this._tableState = resp;
            // return the table state
            return resp;
        };
        /**
         * Toggles the open state of the table.
         *
         * @return {boolean} The new value of the open state.
         */
        this.toggleOpenTable = () => {
            this._openTable = !this._openTable;
            return this._openTable;
        };
        this._tableState = roulette_state_enum_1.RouletteStateEnum.CLOSE;
        this._openTable = false;
        this._wheelState = sts_common_1.GralWheelStateEnum.NO_MORE_BETS;
    }
    /**
     * Retrieves the current state of the roulette table.
     *
     * @return {RouletteStateEnum} The current state of the roulette table.
     */
    get state() {
        return this._tableState;
    }
    /**
     * Gets the current state of the open table flag.
     *
     * @return {boolean} True if the table is open, false otherwise.
     */
    get openTable() {
        return this._openTable;
    }
}
exports.RouletteStateClass = RouletteStateClass;
