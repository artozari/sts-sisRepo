import { ClockWiseEnum } from "sts-common";
import { TcsStateEnum } from "../enums/tsc.wheel.state.enum";

export interface TscWheelStateInterface {
    state: TcsStateEnum;
    previousState: TcsStateEnum;
    timeState: number;
    winningNumber: number | undefined;
    clockWise: ClockWiseEnum | undefined;
    speed: number | undefined;
}