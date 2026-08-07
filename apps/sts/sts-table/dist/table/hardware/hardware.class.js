"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HardwareClass = void 0;
const sts_common_1 = require("sts-common");
const keyboardDriver_1 = require("../../keyboardDriver");
const colors_lights_enum_1 = require("../../interfaces/enums/colors.lights.enum");
class HardwareClass {
    constructor(p_keysQ) {
        this._keyboardDriverClass = new keyboardDriver_1.KeyboardDriverClass(4);
        this.getSignLight = (p_wheelState) => {
            let resp;
            try {
                if (p_wheelState === sts_common_1.GralWheelStateEnum.NO_MORE_BETS) {
                    resp = sts_common_1.EffectsLedLightsEnum.Rotation;
                }
                else if (p_wheelState === sts_common_1.GralWheelStateEnum.WINNING_NUMBER) {
                    resp = sts_common_1.EffectsLedLightsEnum.Rainbow;
                }
                else
                    resp = this._lightColorsConfig;
            }
            catch (error) {
                resp = sts_common_1.EffectsLedLightsEnum.Red;
            }
            return resp;
        };
        // public getSemaphoreColor = (p_wheelState: GralWheelStateEnum): StsSemaphoreEnum => {
        this.getSemaphoreColor = () => {
            let resp;
            try {
                // if (p_wheelState === GralWheelStateEnum.NO_MORE_BETS) {
                //   resp = StsSemaphoreEnum.BLUE;
                // } else if (p_wheelState === GralWheelStateEnum.WINNING_NUMBER) {
                //   resp = StsSemaphoreEnum.WHITE;
                // } else resp = StsSemaphoreEnum.GREEN;
                resp = sts_common_1.StsSemaphoreEnum.GREEN;
            }
            catch (error) {
                resp = sts_common_1.StsSemaphoreEnum.GREEN;
            }
            return resp;
        };
        this.getSemaphoreLights = (p_wheelState) => {
            let resp;
            try {
                if (p_wheelState === sts_common_1.GralWheelStateEnum.NO_MORE_BETS) {
                    resp = 0x03;
                }
                else if (p_wheelState === sts_common_1.GralWheelStateEnum.WINNING_NUMBER) {
                    resp = 0x0c;
                }
                else
                    resp = 0x0f;
            }
            catch (error) {
                resp = 0x0f;
            }
            return resp;
        };
        this.setSemaphoreIntensity = (p_semaphoreIntensityConfig) => {
            const semaphoreIntensity = p_semaphoreIntensityConfig;
            if (semaphoreIntensity === undefined) {
                this._semaphoreIntensity = 5;
            }
            else if (typeof semaphoreIntensity === "number") {
                if (semaphoreIntensity < 0)
                    this._semaphoreIntensityConfig = 0;
                else if (semaphoreIntensity > 100)
                    this._semaphoreIntensityConfig = 10;
                else
                    this._semaphoreIntensityConfig = semaphoreIntensity;
            }
            else
                this._semaphoreIntensity = 5;
            this._semaphoreIntensity = this._semaphoreIntensityConfig;
        };
        this.getSemaphoreIntensity = () => {
            let resp;
            try {
                resp = this._semaphoreIntensity;
                if (resp < 0)
                    resp = 100;
                if (resp > 100)
                    resp = 100;
            }
            catch (error) {
                resp = 100;
            }
            return resp;
        };
        this.setLightColorConfig = (p_colorOfLights) => {
            const colorsLights = Object.keys(colors_lights_enum_1.ColorsLightsEnum).filter((v) => isNaN(Number(v)));
            const colorOfLights = colorsLights.find((color) => color === p_colorOfLights.toLowerCase());
            switch (colorOfLights) {
                case "white":
                    this._lightColorsConfig = sts_common_1.EffectsLedLightsEnum.White;
                    break;
                case "yellow":
                    this._lightColorsConfig = sts_common_1.EffectsLedLightsEnum.Yellow;
                    break;
                case "violet":
                    this._lightColorsConfig = sts_common_1.EffectsLedLightsEnum.Violet;
                    break;
                case "cyan":
                    this._lightColorsConfig = sts_common_1.EffectsLedLightsEnum.Cyano;
                    break;
                case "green":
                    this._lightColorsConfig = sts_common_1.EffectsLedLightsEnum.Green;
                    break;
                case "blue":
                    this._lightColorsConfig = sts_common_1.EffectsLedLightsEnum.Blue;
                    break;
                default:
                    this._lightColorsConfig = sts_common_1.EffectsLedLightsEnum.Violet;
                    break;
            }
        };
        this.setLightsIntensity = (p_lightsIntensityConfig) => {
            const lightsIntensity = p_lightsIntensityConfig;
            if (lightsIntensity === undefined) {
                this._lightsIntensityConfig = 0;
            }
            else if (typeof lightsIntensity === "number") {
                if (lightsIntensity < 0)
                    this._lightsIntensityConfig = 0;
                else if (lightsIntensity > 100)
                    this._lightsIntensityConfig = 100;
                else
                    this._lightsIntensityConfig = lightsIntensity;
            }
            else
                this._lightsIntensityConfig = 0;
            this._lightsIntensity = this._lightsIntensityConfig;
        };
        this.getLightsIntensity = () => {
            let resp;
            try {
                resp = this._lightsIntensity;
                if (resp < 0)
                    resp = 100;
                if (resp > 100)
                    resp = 100;
            }
            catch (error) {
                resp = 100;
            }
            return resp;
        };
        this.procKeys = (arrayKeys) => {
            return this._keyboardDriverClass.procKeys(arrayKeys);
        };
        this.setSevenSegmentDisplay = (p_tableNumberConfig) => {
            this._tableNumberConfig = p_tableNumberConfig;
        };
        this.getSevenSegmentDisplay = (p_wheelState, p_gameNumberEmitter, p_winningNumber) => {
            let resp = this._tableNumberConfig;
            try {
                if (p_wheelState === sts_common_1.GralWheelStateEnum.NO_MORE_BETS) {
                    if (p_gameNumberEmitter !== undefined) {
                        resp = p_gameNumberEmitter + 1;
                        resp = resp % 100;
                    }
                }
                else if (p_wheelState === sts_common_1.GralWheelStateEnum.WINNING_NUMBER) {
                    resp = p_winningNumber ?? resp;
                }
                else
                    resp = this._tableNumberConfig;
            }
            catch (error) {
                resp = 0;
            }
            return resp;
        };
        this.processHardware = (p_hardware, p_wheelState, p_gameNumberEmitter, p_winningNumber) => {
            let resultKey;
            let mqttTx;
            try {
                // check keys
                if (this._hardware === null)
                    this._hardware = p_hardware;
                if (p_hardware === null)
                    throw new Error("Hardware is null");
                const arrayKeys = [p_hardware.k0, p_hardware.k1, p_hardware.k2, p_hardware.k3];
                resultKey = this.procKeys(arrayKeys);
                if (this._hardware !== null) {
                    this._hardware = p_hardware;
                    this.onLine();
                    mqttTx = {
                        time: this._hardware.time,
                        keyType: this._hardware.keyType,
                        key: this._hardware.key,
                        semaphore: this.getSemaphoreColor(),
                        semaphoreLights: this.getSemaphoreLights(p_wheelState),
                        semaphoreIntensity: this.getSemaphoreIntensity(),
                        colorOfLights: this.getSignLight(p_wheelState),
                        lightsIntensity: this.getLightsIntensity(),
                        SevenSegmentDisplay: this.getSevenSegmentDisplay(p_wheelState, p_gameNumberEmitter, p_winningNumber),
                    };
                }
                else
                    mqttTx = null;
            }
            catch (error) {
                resultKey = [];
                mqttTx = null;
            }
            const resp = {
                resultKey,
                mqttTx,
            };
            return resp;
        };
        this.procOnLine = () => {
            if (this._timeOut > 0) {
                const now = Date.now();
                if (now - this._timeOut > 5000) {
                    this._timeOut = 0;
                }
            }
        };
        this.getOnline = () => {
            return this._timeOut > 0;
        };
        this._keyboardDriverClass = new keyboardDriver_1.KeyboardDriverClass(p_keysQ);
        this._lightColorsConfig = sts_common_1.EffectsLedLightsEnum.Off;
        this._lightsIntensity = 100;
        this._lightsIntensityConfig = 100;
        this._semaphoreIntensity = 5;
        this._semaphoreIntensityConfig = 5;
        this._tableNumberConfig = 0;
        this._hardware = null;
        this._timeOut = 0;
        setInterval(this.procOnLine, 500);
    }
    onLine() {
        this._timeOut = Date.now();
    }
}
exports.HardwareClass = HardwareClass;
