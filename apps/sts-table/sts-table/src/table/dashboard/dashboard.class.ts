import { DashboardSemaphoreStateEnum, DashBoardTuple, StsCasinoInterface, StsGameInterface } from "sts-common";
import { isDeepStrictEqual } from "node:util";
import { MqttClientClass, MqttClientConfigInterface } from "@slcn-pkg/mqtt-client-class";
import { MqttObservableClass } from "@slcn-pkg/mqtt-client-observable-class";
import { DashBoardClassConfigInterface } from "../interfaces/dash.board.class.config.interface";
import { DashBoardClassDataInterface } from "../interfaces/dash.board.class.data.interface";

type StrNumBoolType = string | number | boolean;

interface SemaphoreStatusInterface {
  state: DashboardSemaphoreStateEnum;
  gamesQ: number;
}

interface MqttDashboardInterface {
  casinoData: StrNumBoolType[] | undefined;
  tableData: StrNumBoolType[] | undefined;
  configData: StrNumBoolType[] | undefined;
  status: StrNumBoolType[] | undefined;
  winningNumbersData: DashBoardTuple[] | undefined;
  ts: number | undefined;
  gameNumber: number | undefined;
}

export class DashboardClass {
  private _isConnected: boolean = false;
  private _setInterval: NodeJS.Timeout | undefined = undefined;
  private _casino: StsCasinoInterface | undefined = undefined;
  private _mqtt_refresh_time_msec: number = 20000;
  private _mqttDashboard: MqttClientClass | null = null;
  private _dataTable: DashBoardClassDataInterface | undefined = undefined;

  constructor(private readonly _dasboardConfig: DashBoardClassConfigInterface) {
    this._mqtt_refresh_time_msec = 20000;
  }

  public send = () => {
    try {
      if (this._mqttDashboard === null) return;
      if (this._mqttDashboard.isConected() === false) return;

      const mqttTx: MqttDashboardInterface = {
        ts: undefined,
        gameNumber: undefined,
        casinoData: undefined,
        tableData: undefined,
        configData: undefined,
        winningNumbersData: undefined,
        status: undefined,
      };

      if (this._dataTable === undefined) return;
      if (this._dataTable.casino === undefined) return;
      if (this._dataTable.table === undefined) return;

      mqttTx.gameNumber = this._dataTable.gameNumber ?? undefined;
      mqttTx.ts = this._dataTable.ts ?? undefined;

      if (this._dataTable.winningNumbersData !== undefined) {
        this._dataTable.winningNumbersData.forEach((game: StsGameInterface) => {
          const { id, createdAt, gameNumber, winNumber, rpm, openTable, clockwise, enabled, croupierId, tableId } = game;
          const tuple: DashBoardTuple = [id, createdAt, gameNumber, winNumber, rpm, clockwise, openTable, enabled, croupierId, tableId];
          if (mqttTx.winningNumbersData === undefined) mqttTx.winningNumbersData = [];
          mqttTx.winningNumbersData.push(tuple);
        });
      }

      const casinoData: StrNumBoolType[] = [
        "casinoCode",
        this._dataTable.casino.casinoCode,
        "name",
        this._dataTable.casino.name,
        "country",
        this._dataTable.casino.country,
        "province",
        this._dataTable.casino.province,
        "city",
        this._dataTable.casino.city,
        "address",
        this._dataTable.casino.address,
        "mqtt_refresh_time_msec",
        this._dataTable.casino.mqtt_refresh_time_msec,
      ];
      mqttTx.casinoData = casinoData;

      const tableData: StrNumBoolType[] = [
        "id",
        this._dataTable.table.id,
        "name",
        this._dataTable.table.name,
        "shortName",
        this._dataTable.table.shortName,
        "tableNumber",
        this._dataTable.table.tableNumber,
        "key",
        this._dataTable.table.key,
        "positionX",
        this._dataTable.table.posX,
        "positionY",
        this._dataTable.table.posY,
        "layout",
        this._dataTable.table.layout,
        "noSmoking",
        this._dataTable.table.noSmoking,
      ];
      mqttTx.tableData = tableData;

      if (this._dataTable.configuration !== undefined) {
        const configData: StrNumBoolType[] = [
          "wheelType",
          this._dataTable.configuration.wheelType,
          "skyn",
          this._dataTable.configuration.skin,
          "chip",
          this._dataTable.configuration.chip,
          "max",
          this._dataTable.configuration.max,
          "min",
          this._dataTable.configuration.min,
          "colorOfLights",
          this._dataTable.configuration.colorOfLights,
          "lightsIntensity",
          this._dataTable.configuration.lightsIntensity,
          "b36",
          this._dataTable.configuration.b36,
          "b18",
          this._dataTable.configuration.b18,
          "b12",
          this._dataTable.configuration.b12,
          "b9",
          this._dataTable.configuration.b9,
          "b7",
          this._dataTable.configuration.b7,
          "b6",
          this._dataTable.configuration.b6,
          "bCha1",
          this._dataTable.configuration.bCha1,
          "bCha2",
          this._dataTable.configuration.bCha2,
          "language",
          this._dataTable.configuration.lang,
          "language2",
          this._dataTable.configuration.lang2,
          "language3",
          this._dataTable.configuration.lang3,
        ];
        mqttTx.configData = configData;
      }

      const semaphoreStatus:SemaphoreStatusInterface = this.getSemaphoreStatus();
      const tableStatus: StrNumBoolType[] = [
        "semaphore", 
        semaphoreStatus.state,
        "semaphoreGames",
        semaphoreStatus.gamesQ
      ];
      mqttTx.status = tableStatus;

      const mqttTxJson: string = JSON.stringify(mqttTx);
      const topic: string = `sts/dashboard/local/${this._dataTable.casino.casinoCode}/${this._dataTable.table.shortName}`;
      this._mqttDashboard.publish(topic, mqttTxJson);
    } catch (error) {
      // empty
    }
  };

  public connect = (p_casino: StsCasinoInterface) => {
    try {
      const bChangeCasino: boolean = isDeepStrictEqual(this._casino, p_casino) === false;

      this._isConnected = true;

      let mqtt_refresh_time_msec: number = isNaN(p_casino.mqtt_refresh_time_msec) ? 20000 : 1000 * p_casino.mqtt_refresh_time_msec;
      if (mqtt_refresh_time_msec > 60000 || mqtt_refresh_time_msec < 1000) {
        mqtt_refresh_time_msec = 20000;
      }

      const bSetInterval: boolean = this._setInterval === undefined;
      if (bSetInterval === true || bChangeCasino === true) {
        this.reloadConfig(p_casino, mqtt_refresh_time_msec);
      }
    } catch (error) {
      // empty
    }
  };

  private readonly reloadConfig = (p_casino: StsCasinoInterface, p_mqtt_refresh_time_msec: number) => {
    try {
      this._casino = p_casino;
      if (this._setInterval !== undefined) clearInterval(this._setInterval);
      this._mqtt_refresh_time_msec = p_mqtt_refresh_time_msec;
      this._setInterval = setInterval(this.send, this._mqtt_refresh_time_msec);
      this.disconnectMqtt();
    } catch (error) {
      // empty
    }
  };

  private readonly disconnectMqtt = () => {
    try {
      if (this._mqttDashboard !== null) {
        if (this._mqttDashboard.isConected()) {
          this._mqttDashboard.close();
        }
      }
      setTimeout(this.connectMqtt, 2000);
    } catch (error) {
      // empty
    }
  };

  private readonly connectMqtt = () => {
    try {
      this._mqttDashboard = null;
      if (this._casino !== undefined) {
        const subject: MqttObservableClass = new MqttObservableClass();
        const mqttClientConfig: MqttClientConfigInterface = {
          name: "MQTT_DASHBOARD",
          srvName: this._dasboardConfig.srvName,
          ip: this._dasboardConfig.ip,
          urlMqtt: this._casino.mqtt_url ?? "localhost",
          portMqtt: this._casino.mqtt_port ?? 1883,
          username: this._casino.mqtt_user ?? "",
          password: this._casino.mqtt_password ?? "",
          portHttp: this._dasboardConfig.portHttp,
          portHttps: this._dasboardConfig.portHttps,
          protocol: this._casino.mqtt_protocol ?? "wss",
          serviceId: this._dasboardConfig.serviceId,
          subject,
        };
        this._mqttDashboard = new MqttClientClass(mqttClientConfig, null);
        this._mqttDashboard.start();
      }
    } catch (error) {
      // empty
    }
  };

  public setData = (p_data: DashBoardClassDataInterface): void => {
    this._dataTable = p_data;
  };

  public isOnLine = (): boolean => {
    let resp: boolean;

    try {
      if (this._mqttDashboard === null) {
        resp = false;
      } else {
        resp = this._mqttDashboard.isConected();
      }
    } catch (error) {
      resp = false;
    }

    return resp;
  };

  private readonly getSemaphoreStatus = (): SemaphoreStatusInterface => {
    const resp: SemaphoreStatusInterface = {} as SemaphoreStatusInterface;

    try {
      const min: number = 10;
      const green: number = 4;
      const yellow: number = 2;
      let gamesQ: number = 0;

      if (this._dataTable) {
        if (this._dataTable.winningNumbersData !== undefined) {
          const now: number = Date.now();
          const milliSecs: number = 60 * 1000 * min;

          for (const game in this._dataTable.winningNumbersData) {
            const gameObj: StsGameInterface = this._dataTable.winningNumbersData[game];
            const createdAt: Date = new Date(gameObj.createdAt);
            const diff: number = now - createdAt.getTime();

            if (milliSecs >= diff) {
              gamesQ += 1;
            } else break;
          }
        }
      }

      if (gamesQ >= green) {
        resp.state = DashboardSemaphoreStateEnum.Green;
        resp.gamesQ = gamesQ;
      } else if (gamesQ >= yellow) {
        resp.state = DashboardSemaphoreStateEnum.Yellow;
        resp.gamesQ = gamesQ;
      } else {
        resp.state = DashboardSemaphoreStateEnum.Red;
        resp.gamesQ = gamesQ;
      }
    } catch (error) {
      resp.state = DashboardSemaphoreStateEnum.Red;
      resp.gamesQ = 0;
    }

    return resp;
  };
}
