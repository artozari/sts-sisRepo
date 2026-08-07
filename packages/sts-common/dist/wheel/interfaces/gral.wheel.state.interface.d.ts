import { GralWheelStateEnum } from "sts-common/wheel/enums/gral.wheel.state.enum";
import { ClockWiseEnum } from "../enums/tsc.wheel.clockwise.enum";
export interface GralWheelStateInterface {
    state: GralWheelStateEnum;
    timeState: number;
    winningNumber: number | undefined;
    clockWise: ClockWiseEnum | undefined;
    speed: number | undefined;
}
//# sourceMappingURL=gral.wheel.state.interface.d.ts.map