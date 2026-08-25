import { CutOffInterface } from "sts-common";

export class CutOffClass {
    private _lastCutOffEmitter: CutOffInterface | undefined = undefined;
    private _enabled: boolean = false;

    public setCutOff(cutOff: CutOffInterface): void {
        this._lastCutOffEmitter = cutOff;
    }

    private checkCutOffEnabled(): boolean {
        if (this._lastCutOffEmitter) {
            const now = Date.now();
            const cutOffTime = new Date(this._lastCutOffEmitter.time).getTime();
            this._enabled = now < cutOffTime;
        } else {
            this._enabled = false;
        }
        return this._enabled;
    }

    public get enabled(): boolean {
        this.checkCutOffEnabled();
        return this._enabled;
    }

    public get cutOffTime(): string | null {
        return this._lastCutOffEmitter?.time ?? null;
    }
}
