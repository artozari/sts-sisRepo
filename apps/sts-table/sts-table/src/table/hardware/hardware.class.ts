import { EffectsLedLightsEnum, GralWheelStateEnum, StsHardwareMqttRx, StsHardwareMqttTx, StsSemaphoreEnum } from "sts-common";
import { KeyboardDriverClass, KeyboardDriverInterface } from "../../keyboardDriver";
import { ColorsLightsEnum } from "../../interfaces/enums/colors.lights.enum";

export class HardwareClass {
  private _lightColorsConfig: EffectsLedLightsEnum;
  private _lightsIntensity: number;
  private _lightsIntensityConfig: number;
  private _semaphoreIntensity: number;
  private _semaphoreIntensityConfig: number;
  private readonly _keyboardDriverClass: KeyboardDriverClass = new KeyboardDriverClass(4);
  private _tableNumberConfig: number;
  private _hardware: StsHardwareMqttRx | null;
  private _timeOut: number;

  constructor(p_keysQ: number) {
    this._keyboardDriverClass = new KeyboardDriverClass(p_keysQ);
    this._lightColorsConfig = EffectsLedLightsEnum.Off;
    this._lightsIntensity = 100;
    this._lightsIntensityConfig = 100;
    this._semaphoreIntensity = 5;
    this._semaphoreIntensityConfig = 5;
    this._tableNumberConfig = 0;
    this._hardware = null;
    this._timeOut = 0;

    setInterval(this.procOnLine, 500);
  }

  public getSignLight = (p_wheelState: GralWheelStateEnum): EffectsLedLightsEnum => {
    let resp: EffectsLedLightsEnum;

    try {
      if (p_wheelState === GralWheelStateEnum.NO_MORE_BETS) {
        resp = EffectsLedLightsEnum.Rotation;
      } else if (p_wheelState === GralWheelStateEnum.WINNING_NUMBER) {
        resp = EffectsLedLightsEnum.Rainbow;
      } else resp = this._lightColorsConfig;
    } catch (error) {
      resp = EffectsLedLightsEnum.Red;
    }

    return resp;
  };

  // public getSemaphoreColor = (p_wheelState: GralWheelStateEnum): StsSemaphoreEnum => {
  public getSemaphoreColor = (): StsSemaphoreEnum => {
    let resp: StsSemaphoreEnum;

    try {
      // if (p_wheelState === GralWheelStateEnum.NO_MORE_BETS) {
      //   resp = StsSemaphoreEnum.BLUE;
      // } else if (p_wheelState === GralWheelStateEnum.WINNING_NUMBER) {
      //   resp = StsSemaphoreEnum.WHITE;
      // } else resp = StsSemaphoreEnum.GREEN;
      resp = StsSemaphoreEnum.GREEN;
    } catch (error) {
      resp = StsSemaphoreEnum.GREEN;
    }

    return resp;
  };

  public getSemaphoreLights = (p_wheelState: GralWheelStateEnum): number => {
    let resp: number;

    try {
      if (p_wheelState === GralWheelStateEnum.NO_MORE_BETS) {
        resp = 0x03;
      } else if (p_wheelState === GralWheelStateEnum.WINNING_NUMBER) {
        resp = 0x0c;
      } else resp = 0x0f;
    } catch (error) {
      resp = 0x0f;
    }

    return resp;
  };

  public setSemaphoreIntensity = (p_semaphoreIntensityConfig: number) => {
    const semaphoreIntensity: number | undefined = p_semaphoreIntensityConfig;

    if (semaphoreIntensity === undefined) {
      this._semaphoreIntensity = 5;
    } else if (typeof semaphoreIntensity === "number") {
      if (semaphoreIntensity < 0) this._semaphoreIntensityConfig = 0;
      else if (semaphoreIntensity > 100) this._semaphoreIntensityConfig = 10;
      else this._semaphoreIntensityConfig = semaphoreIntensity;
    } else this._semaphoreIntensity = 5;

    this._semaphoreIntensity = this._semaphoreIntensityConfig;
  };

  public getSemaphoreIntensity = (): number => {
    let resp: number;

    try {
      resp = this._semaphoreIntensity;
      if (resp < 0) resp = 100;
      if (resp > 100) resp = 100;
    } catch (error) {
      resp = 100;
    }

    return resp;
  };

  public setLightColorConfig = (p_colorOfLights: string) => {
    const colorsLights = Object.keys(ColorsLightsEnum).filter((v) => isNaN(Number(v)));
    const colorOfLights: string | undefined = colorsLights.find((color) => color === p_colorOfLights.toLowerCase());

    switch (colorOfLights) {
      case "white":
        this._lightColorsConfig = EffectsLedLightsEnum.White;
        break;
      case "yellow":
        this._lightColorsConfig = EffectsLedLightsEnum.Yellow;
        break;
      case "violet":
        this._lightColorsConfig = EffectsLedLightsEnum.Violet;
        break;
      case "cyan":
        this._lightColorsConfig = EffectsLedLightsEnum.Cyano;
        break;
      case "green":
        this._lightColorsConfig = EffectsLedLightsEnum.Green;
        break;
      case "blue":
        this._lightColorsConfig = EffectsLedLightsEnum.Blue;
        break;
      default:
        this._lightColorsConfig = EffectsLedLightsEnum.Violet;
        break;
    }
  };

  public setLightsIntensity = (p_lightsIntensityConfig: number) => {
    const lightsIntensity: number | undefined = p_lightsIntensityConfig;

    if (lightsIntensity === undefined) {
      this._lightsIntensityConfig = 0;
    } else if (typeof lightsIntensity === "number") {
      if (lightsIntensity < 0) this._lightsIntensityConfig = 0;
      else if (lightsIntensity > 100) this._lightsIntensityConfig = 100;
      else this._lightsIntensityConfig = lightsIntensity;
    } else this._lightsIntensityConfig = 0;

    this._lightsIntensity = this._lightsIntensityConfig;
  };

  public getLightsIntensity = (): number => {
    let resp: number;

    try {
      resp = this._lightsIntensity;
      if (resp < 0) resp = 100;
      if (resp > 100) resp = 100;
    } catch (error) {
      resp = 100;
    }

    return resp;
  };

  public procKeys = (arrayKeys: boolean[]): KeyboardDriverInterface[] => {
    return this._keyboardDriverClass.procKeys(arrayKeys);
  };

  public setSevenSegmentDisplay = (p_tableNumberConfig: number): void => {
    this._tableNumberConfig = p_tableNumberConfig;
  };

  public getSevenSegmentDisplay = (
    p_wheelState: GralWheelStateEnum,
    p_gameNumberEmitter: number | undefined,
    p_winningNumber: number | undefined
  ): number => {
    let resp: number = this._tableNumberConfig;

    try {
      if (p_wheelState === GralWheelStateEnum.NO_MORE_BETS) {
        if (p_gameNumberEmitter !== undefined) {
          resp = p_gameNumberEmitter + 1;
          resp = resp % 100;
        }
      } else if (p_wheelState === GralWheelStateEnum.WINNING_NUMBER) {
        resp = p_winningNumber ?? resp;
      } else resp = this._tableNumberConfig;
    } catch (error) {
      resp = 0;
    }

    return resp;
  };

  public processHardware = (
    p_hardware: StsHardwareMqttRx | null,
    p_wheelState: GralWheelStateEnum,
    p_gameNumberEmitter?: number,
    p_winningNumber?: number
  ): { resultKey: KeyboardDriverInterface[]; mqttTx: StsHardwareMqttTx | null } => {
    let resultKey: KeyboardDriverInterface[];
    let mqttTx: StsHardwareMqttTx | null;

    try {
      // check keys
      if (this._hardware === null) this._hardware = p_hardware;
      if (p_hardware === null) throw new Error("Hardware is null");

      const arrayKeys: boolean[] = [p_hardware.k0, p_hardware.k1, p_hardware.k2, p_hardware.k3];
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
      } else mqttTx = null;
    } catch (error) {
      resultKey = [];
      mqttTx = null;
    }

    const resp = {
      resultKey,
      mqttTx,
    };

    return resp;
  };

  private onLine(): void {
    this._timeOut = Date.now();
  }

  private readonly procOnLine = (): void => {
    if (this._timeOut > 0) {
      const now: number = Date.now();
      if (now - this._timeOut > 5000) {
        this._timeOut = 0;
      }
    }
  };

  public getOnline = (): boolean => {
    return this._timeOut > 0;
  };
}
