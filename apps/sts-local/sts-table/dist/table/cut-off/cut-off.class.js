"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CutOffClass = void 0;
class CutOffClass {
    constructor() {
        this._lastCutOffEmitter = undefined;
        this._enabled = false;
    }
    setCutOff(cutOff) {
        this._lastCutOffEmitter = cutOff;
    }
    checkCutOffEnabled() {
        if (this._lastCutOffEmitter) {
            const now = Date.now();
            const cutOffTime = new Date(this._lastCutOffEmitter.time).getTime();
            this._enabled = now < cutOffTime;
        }
        else {
            this._enabled = false;
        }
        return this._enabled;
    }
    get enabled() {
        this.checkCutOffEnabled();
        return this._enabled;
    }
    get cutOffTime() {
        return this._lastCutOffEmitter?.time ?? null;
    }
}
exports.CutOffClass = CutOffClass;
