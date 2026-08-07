import { GralWheelStateEnum, GralWheelStateInterface } from "sts-common";
import { TableWheelStateInterface } from "../../interfaces/table.wheel.state.interface";
import { GeneralLoggerClass } from "@slcn-pkg/general-logger-class";
import { LevelsLoggerEnum } from "@slcn-pkg/general-logger-constants";

const TIME_OUT: number = 5000;

export class WheelTcsClass {
  private _wheelState: TableWheelStateInterface;

  constructor(private readonly _LOGS: GeneralLoggerClass | null) {
    this._wheelState = {} as TableWheelStateInterface;

    this.activateOffLine();
    setInterval(this.checkOnLine, 500);
  }

  private readonly setOffLine = () => {
    this._wheelState.state = GralWheelStateEnum.OFF_LINE;
    this._wheelState.timeState = 0;
    this._wheelState.winningNumber = undefined;
    this._wheelState.clockWise = undefined;
    this._wheelState.speed = undefined;
    this._wheelState.time = 0;
  };

  private readonly setOnLine = (p_state: GralWheelStateInterface) => {
    if (this._wheelState.time === 0 || this._wheelState === undefined) this.activateOnLine();
    this._wheelState = <TableWheelStateInterface>p_state;
    this._wheelState.time = Date.now();
  };

  /**
   * Checks if the table is online.
   * If the table has been offline for more than 5 seconds, it activates the offline mode and sets the table as offline.
   */
  public checkOnLine = () => {
    const deltaT: number = Date.now() - this._wheelState.time;
    if (deltaT > TIME_OUT) {
      if (this._wheelState.time !== 0) this.activateOffLine();
      this.setOffLine();
    }
  };

  /**
   * Activate the offline mode of the roulette wheel.
   */
  private readonly activateOffLine = () => {
    this.setOffLine();
    this.log(LevelsLoggerEnum.emerg, "WHELL OFF LINE");
  };

  /**
   * Activate the online mode of the roulette wheel.
   */ private readonly activateOnLine = () => {
    this.log(LevelsLoggerEnum.info, "WHELL ON LINE");
  };

  /**
   * Handles the change of state in the table.
   *
   * @param p_lastState - The previous state of the table.
   * @param p_dataRx - The received data containing the new state.
   */
  private readonly procChangeState = (
    p_lastState: GralWheelStateEnum,
    p_dataRx: GralWheelStateInterface
  ): { state: GralWheelStateEnum; change: boolean } => {
    let change: boolean;
    let state: GralWheelStateEnum;

    try {
      if (p_lastState !== this._wheelState.state) {
        change = true;
        state = this._wheelState.state;

        let strMetaData: string = "";
        if (p_lastState === 1 && p_dataRx.state === 2) {
          strMetaData = " ||| " + new Date().toISOString();
        }

        const lastState: string = this.strGralWheelStateEnum(p_lastState);
        const nextState: string = this.strGralWheelStateEnum(p_dataRx.state);
        this.log(LevelsLoggerEnum.info, `STATE: ${lastState} --> ${nextState}${strMetaData}`);

        switch (p_dataRx.state) {
          case GralWheelStateEnum.OFF_LINE:
            this.activateOffLine();
            break;
          case GralWheelStateEnum.PLACE_YOUR_BETS:
            break;
          case GralWheelStateEnum.NO_MORE_BETS:
            break;
          case GralWheelStateEnum.WINNING_NUMBER:
            break;
          default:
            this.activateOffLine();
            break;
        }
      } else {
        change = false;
        state =
          this._wheelState.state < GralWheelStateEnum.MAX && this._wheelState.state >= 0
            ? this._wheelState.state
            : GralWheelStateEnum.OFF_LINE;
      }
    } catch (error) {
      change = false;
      state = GralWheelStateEnum.OFF_LINE;
    }

    const resp = { state, change };
    return resp;
  };

  /**
   * Processes the received data from the sts-wheel service.
   *
   * @param p_dataRx - The received data from the sts-wheel service.
   */
  public procRxWheel = (p_dataRx: GralWheelStateInterface): { state: GralWheelStateEnum; change: boolean } => {
    let resp: { state: GralWheelStateEnum; change: boolean };
    try {
      const lastState: GralWheelStateEnum = this._wheelState.state;

      this.setOnLine(p_dataRx);

      resp = this.procChangeState(lastState, p_dataRx);
    } catch (error) {
      resp = { state: GralWheelStateEnum.OFF_LINE, change: false };
    }
    return resp;
  };

  public isOnLine = (): boolean => {
    return this._wheelState.state !== GralWheelStateEnum.OFF_LINE;
  };

  public getWheelState = (): GralWheelStateEnum => {
    return this._wheelState.state;
  };

  public getWheelWinningNumber = (): number | undefined => {
    return this._wheelState.winningNumber;
  };

  private readonly log = (p_level: LevelsLoggerEnum, p_msg: string): void => {
    if (this._LOGS !== null) this._LOGS.proc(p_level, p_msg);
  };

  private readonly strGralWheelStateEnum = (e: GralWheelStateEnum): string => {
    try {
      const strEnums: string = Object.keys(GralWheelStateEnum)[e + GralWheelStateEnum.MAX + 1];
      return strEnums;
    } catch (error) {
      return e.toString();
    }
  };
}
