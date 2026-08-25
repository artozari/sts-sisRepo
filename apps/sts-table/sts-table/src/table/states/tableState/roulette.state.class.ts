import { GralWheelStateEnum } from "sts-common";
import { RouletteStateEnum } from "./roulette.state.enum";

/**
 * Class representing the state of a roulette table.
 *
 * The class allows for setting and retrieving the state of the table based on the wheel state and the open table flag.
 */
export class RouletteStateClass {
  /**
   * The current state of the roulette table.
   *
   * @type {RouletteStateEnum}
   * @private
   */
  private _tableState: RouletteStateEnum;

  /**
   * The current state of the wheel.
   *
   * @type {GralWheelStateEnum}
   * @private
   */
  private _wheelState: GralWheelStateEnum;

  /**
   * Flag indicating whether the table is open.
   *
   * @type {boolean}
   * @private
   */
  private _openTable: boolean;

  /**
   * Initializes a new instance of the RouletteStateClass.
   *
   * Sets the initial state of the table, open table flag, and wheel state.
   */
  constructor() {
    this._tableState = RouletteStateEnum.CLOSE;
    this._openTable = false;
    this._wheelState = GralWheelStateEnum.NO_MORE_BETS;
  }

  /**
   * Sets the state of the roulette table based on the provided wheel state and the open table flag.
   *
   * @param {GralWheelStateEnum} p_wheelState - The state of the wheel to set the table state from.
   * @return {RouletteStateEnum} The state of the table after setting it based on the provided wheel state and the open table flag.
   */
  public setTableState = (p_wheelState: GralWheelStateEnum): RouletteStateEnum => {
    let resp: RouletteStateEnum;

    // save the current wheel state
    this._wheelState = p_wheelState;

    try {
      // if the table is not open, set the state to CLOSE
      if (this._openTable === false) {
        resp = RouletteStateEnum.CLOSE;
      } else if (this._wheelState === GralWheelStateEnum.NO_MORE_BETS) {
        // if the wheel is in the NO_MORE_BETS state, set the table state to NO_MORE_BETS
        resp = RouletteStateEnum.NO_MORE_BETS;
      } else if (this._wheelState === GralWheelStateEnum.WINNING_NUMBER) {
        // if the wheel is in the NO_MORE_BETS state, set the table state to NO_MORE_BETS
        resp = RouletteStateEnum.WINNING_NUMBER;
      } else {
        // if the wheel is in any other state, set the table state to PLACE_YOUR_BETS
        resp = RouletteStateEnum.PLACE_YOUR_BETS;
      }
    } catch (error) {
      // if there is an error, set the table state to ERROR
      resp = RouletteStateEnum.ERROR;
    }

    // save the table state
    this._tableState = resp;
    // return the table state
    return resp;
  };

  /**
   * Retrieves the current state of the roulette table.
   *
   * @return {RouletteStateEnum} The current state of the roulette table.
   */
  public get state(): RouletteStateEnum {
    return this._tableState;
  }

  /**
   * Gets the current state of the open table flag.
   *
   * @return {boolean} True if the table is open, false otherwise.
   */
  public get openTable(): boolean {
    return this._openTable;
  }

  /**
   * Toggles the open state of the table.
   *
   * @return {boolean} The new value of the open state.
   */
  public toggleOpenTable = (): boolean => {
    this._openTable = !this._openTable;
    return this._openTable;
  };
}
