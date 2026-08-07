import MersenneTwister from "mersenne-twister";
import { SkinEnum, StatisticsQEnum, StsConfigurationInterface, StsTableInterface, WheelTypeEnum } from "sts-common";
import { RouletteStateEnum } from "../states";
import { MqttTxObservableInterface } from "@slcn-pkg/mqtt-client-observable-class";
import { HistoricalStatisticsInterface } from "../../interfaces/historical.statistics.interface";
import { DozenType } from "../types/dozen.type";
import { ColumnType } from "../types/column.type";

interface HotAndColdInterface {
  winningNumber: number;
  q: number;
}

interface HotAndColdRespInterface {
  hot: number[];
  cold: number[];
}

export class SignBoardClass {
    private _statisticsNumbers: number[] = [];

    constructor() {
        console.log("Sign Board Class");
    }

    private readonly generateFalseWinNumber = (p_tableId: number, p_numberWheelQ: number, p_statisticsrQ: number): number[] => {
        let resp: number[] = [];

        try {
            const randomGenerator = new MersenneTwister();
            randomGenerator.init_seed(p_tableId);

            for (let i = 0; i < p_statisticsrQ; i++) {
                const rnd: number = randomGenerator.random_int() % p_numberWheelQ;
                resp.push(rnd);
            }
        } catch (error) {
            resp = new Array(p_statisticsrQ).fill(0);
        }

        return resp;
    };

    private readonly generateWinNumbers = (p_tableId: number, p_winningNumbers: number[] | undefined, p_numberWheelQ: number, p_statisticsrQ: number): number[] => {
        let resp: number[] = [];
        try {
            if (p_winningNumbers === undefined) p_winningNumbers = [];

            if (p_winningNumbers.length < p_statisticsrQ) {
                const falseWinNumbers: number[] = this.generateFalseWinNumber(p_tableId, p_numberWheelQ, p_statisticsrQ);
                resp = p_winningNumbers.concat(falseWinNumbers);
                resp.length = p_statisticsrQ;
            } else resp = p_winningNumbers;
        } catch (error) {
            resp = new Array(p_numberWheelQ).fill(0);
        }

        return resp;
    };

    private readonly genHotAndCold = (p_statistics: number[]): HotAndColdRespInterface => {
        let resp: HotAndColdRespInterface = {} as HotAndColdRespInterface;
        try {
            const length: number = p_statistics.length;
            if (length === 37 || length === 38) {
                const array: HotAndColdInterface[] = [];
                p_statistics.forEach((p_value: number, p_index: number) => {
                    array.push({
                        winningNumber: p_index,
                        q: p_value,
                    });
                });

                // sort the array by quantity
                array.sort((a: HotAndColdInterface, b: HotAndColdInterface) => a.q - b.q);

                // Calculation of hot and cold numbers
                const hot: number[] = [];
                const cold: number[] = [];
                for (let i = 0; i < array.length; i++) {
                    if (i < 18) {
                        cold.push(array[i].winningNumber);
                    } else {
                        hot.unshift(array[i].winningNumber);
                    }
                }
                resp = {
                    hot: hot,
                    cold: cold,
                };
            }
        } catch (error) {
            resp = {
                hot: [],
                cold: [],
            };
        }
        return resp;
    };

    private readonly isEven = (p_winningNumber: number, p_historicalStatistics: HistoricalStatisticsInterface): HistoricalStatisticsInterface => {
        // check if the number is even or odd
        let bEven: boolean | null = false;
        try {
            if (p_winningNumber % 2 === 0) bEven = true;
        } catch (error) {
            bEven = null;
        }

        // increment the statistics
        if (bEven === true) p_historicalStatistics.even++;
        else if (bEven === false) p_historicalStatistics.odd++;

        // output
        return p_historicalStatistics;
    };

    private readonly isRed = (p_winningNumber: number, p_historicalStatistics: HistoricalStatisticsInterface): HistoricalStatisticsInterface => {
        // check if the number is red or black
        let bRed: boolean | null = false;
        try {
            const redNumbers: number[] = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
            bRed = redNumbers.includes(p_winningNumber);
        } catch (error) {
            bRed = null;
        }

        // increment the statistics
        if (bRed === true) p_historicalStatistics.red++;
        else if (bRed === false) p_historicalStatistics.black++;

        // output
        return p_historicalStatistics;
    };

    private readonly is_1_18 = (p_winningNumber: number, p_historicalStatistics: HistoricalStatisticsInterface): HistoricalStatisticsInterface => {
        // check if the number is 1-18 or 19-36
        let b_1_18: boolean | null = null;
        try {
            if (p_winningNumber >= 1 && p_winningNumber <= 18) b_1_18 = true;
            else if (p_winningNumber >= 19 && p_winningNumber <= 36) b_1_18 = false;
        } catch (error) {
            b_1_18 = null;
        }

        // increment the statistics
        if (b_1_18 === true) p_historicalStatistics._1_18++;
        else if (b_1_18 === false) p_historicalStatistics._19_36++;

        // output
        return p_historicalStatistics;
    };

    private readonly getColumn = (p_winningNumber: number, p_historicalStatistics: HistoricalStatisticsInterface): HistoricalStatisticsInterface => {
        // check the column
        let column: ColumnType = null;
        try {
            if (p_winningNumber >= 1 && p_winningNumber <= 12) column = 1;
            else if (p_winningNumber >= 13 && p_winningNumber <= 24) column = 2;
            else if (p_winningNumber >= 25 && p_winningNumber <= 36) column = 3;
        } catch (error) {
            column = null;
        }

        // increment the statistics
        if (column === 1) p_historicalStatistics.c1++;
        else if (column === 2) p_historicalStatistics.c2++;
        else if (column === 3) p_historicalStatistics.c3++;

        // output
        return p_historicalStatistics;
    };

    private readonly getDozen = (p_winningNumber: number, p_historicalStatistics: HistoricalStatisticsInterface): HistoricalStatisticsInterface => {
        let dozen: DozenType = null;
        try {
            const mod: number = p_winningNumber % 3;
            if (mod === 0) dozen = 3;
            else if (mod === 1) dozen = 1;
            else if (mod === 2) dozen = 2;
        } catch (error) {
            dozen = null;
        }

        // increment the statistics
        if (dozen === 1) p_historicalStatistics.d1++;
        else if (dozen === 2) p_historicalStatistics.d2++;
        else if (dozen === 3) p_historicalStatistics.d3++;

        // output
        return p_historicalStatistics;
    };

    private readonly ConvertToPercentage = (p_winningNumberLength: number, p_historicalStatistics: HistoricalStatisticsInterface): HistoricalStatisticsInterface => {
        try {
            if (p_winningNumberLength >= 1) {
                p_historicalStatistics.c1 = Math.round((100 * p_historicalStatistics.c1) / p_winningNumberLength);
                p_historicalStatistics.c2 = Math.round((100 * p_historicalStatistics.c2) / p_winningNumberLength);
                p_historicalStatistics.c3 = Math.round((100 * p_historicalStatistics.c3) / p_winningNumberLength);
                p_historicalStatistics.d1 = Math.round((100 * p_historicalStatistics.d1) / p_winningNumberLength);
                p_historicalStatistics.d2 = Math.round((100 * p_historicalStatistics.d2) / p_winningNumberLength);
                p_historicalStatistics.d3 = Math.round((100 * p_historicalStatistics.d3) / p_winningNumberLength);
                p_historicalStatistics.green = Math.round((100 * p_historicalStatistics.green) / p_winningNumberLength);
                p_historicalStatistics.red = Math.round((100 * p_historicalStatistics.red) / p_winningNumberLength);
                p_historicalStatistics.black = Math.round((100 * p_historicalStatistics.black) / p_winningNumberLength);
                p_historicalStatistics.even = Math.round((100 * p_historicalStatistics.even) / p_winningNumberLength);
                p_historicalStatistics.odd = Math.round((100 * p_historicalStatistics.odd) / p_winningNumberLength);
                p_historicalStatistics._1_18 = Math.round((100 * p_historicalStatistics._1_18) / p_winningNumberLength);
                p_historicalStatistics._19_36 = Math.round((100 * p_historicalStatistics._19_36) / p_winningNumberLength);
            }
        } catch (err) {
            // empty
        }

        return p_historicalStatistics;
    };

    private readonly generateStatsitics = (p_numberQ: number, p_winningNumber: number[]): HistoricalStatisticsInterface => {
        let resp: HistoricalStatisticsInterface = {
            green: 0,
            _1_18: 0,
            _19_36: 0,
            red: 0,
            black: 0,
            even: 0,
            odd: 0,
            d1: 0,
            d2: 0,
            d3: 0,
            c1: 0,
            c2: 0,
            c3: 0,
            hot: [],
            cold: [],
        };
        try {
            if (p_numberQ !== 37 && p_numberQ !== 38) throw new Error("Invalid amount of roulette numbers");

            const statisticsNumbers: number[] = new Array(p_numberQ).fill(0);
            for (const element of p_winningNumber) {
                const winningNumber = element;
                if (winningNumber < p_numberQ) {
                    // statistics
                    statisticsNumbers[winningNumber]++;
                    // greens (0 and 00)
                    if (winningNumber === 0 || winningNumber === 37) {
                        resp.green++;
                    } else if (winningNumber >= 1 && winningNumber <= 36) {
                        // ** calculates the statistics of the chances **
                        // even and odd
                        resp = this.isEven(winningNumber, resp);
                        // 1 to 18 and 19 to 36
                        resp = this.is_1_18(winningNumber, resp);
                        // red and black
                        resp = this.isRed(winningNumber, resp);
                        // columns
                        resp = this.getColumn(winningNumber, resp);
                        // dozens
                        resp = this.getDozen(winningNumber, resp);
                    }
                }
            }

            // convert to percentage
            resp = this.ConvertToPercentage(p_winningNumber.length, resp);

            // hot and cold
            const { hot, cold }: HotAndColdRespInterface = this.genHotAndCold(statisticsNumbers);
            resp.hot = hot;
            resp.cold = cold;

            // load statistics
            this._statisticsNumbers = [];
            this._statisticsNumbers = statisticsNumbers;
        } catch (error) {
            this._statisticsNumbers = [];
            this._statisticsNumbers = new Array(p_numberQ).fill(0);
        }

        return resp;
    };

    /**
     * Retrieves the bet configuration.
     * @returns The bet configuration object with the following properties:
     * - max: The maximum bet amount.
     * - min: The minimum bet amount.
     * - chip: The chip bet amount.
     * - b36: The bet amount for option b36.
     * - b18: The bet amount for option b18.
     * - b12: The bet amount for option b12.
     * - b9: The bet amount for option b9.
     * - b6: The bet amount for option b6.
     * - b7: The bet amount for option b7.
     * - bCha1: The bet amount for option bCha1.
     * - bCha2: The bet amount for option bCha2.
     */
    private readonly getBetConfig = (p_configurationEmitter: StsConfigurationInterface) => {
        return {
            max: (p_configurationEmitter?.max ?? 0) / 100,
            min: (p_configurationEmitter?.min ?? 0) / 100,
            chip: (p_configurationEmitter?.chip ?? 0) / 100,
            b36: (p_configurationEmitter?.b36 ?? 0) / 100,
            b18: (p_configurationEmitter?.b18 ?? 0) / 100,
            b12: (p_configurationEmitter?.b12 ?? 0) / 100,
            b9: (p_configurationEmitter?.b9 ?? 0) / 100,
            b6: (p_configurationEmitter?.b6 ?? 0) / 100,
            b7: (p_configurationEmitter?.b7 ?? 0) / 100,
            bCha1: (p_configurationEmitter?.bCha1 ?? 0) / 100,
            bCha2: (p_configurationEmitter?.bCha2 ?? 0) / 100,
        };
    };

    /**
     * Creates a response object with the given parameters.
     *
     * @param {number} table_state - The state of the table.
     * @param {number[]} last_numbers - The last numbers.
     * @param {number[]} statistics - The statistics.
     * @param {unknown} betConfig - The bet configuration.
     * @returns {object} - The response object.
     */
    private readonly createResponseObject = (
        table_state: number,
        last_numbers: number[],
        statistics: number[],
        betConfig: unknown,
        historicalStatistics: unknown,
        services: string,
        p_gameNumberEmitter: number | undefined,
    ): object => {
        return {
            table_state,
            last_numbers: last_numbers.slice(0, 30),
            statistics,
            ts: Date.now(),
            betConfig,
            historicalStatistics,
            services,
            gameNumber: p_gameNumberEmitter,
        };
    };

    private readonly getSkinNumber = (p_skin: string): number => {
        try {
            const maxIndex = Object.keys(SkinEnum).length;
            const index = Object.keys(SkinEnum).indexOf(p_skin);

            if (index >= 0 && index < maxIndex) {
                return index;
            } else return 0;
        } catch (error) {
            return 0;
        }
    };

    private readonly getWheelTypeNumber = (p_wheelType: string): number => {
        try {
            switch (p_wheelType) {
                case "FR37":
                    return 2;
                case "FR38":
                    return 1;
                case "AM38":
                    return 0;
                default:
                    return 2;
            }
        } catch (error) {
            return 2;
        }
    };

    private readonly getNumberOfWheelPositions = (p_wheelType: string): number => {
        try {
            switch (p_wheelType) {
                case "FR37":
                    return 37;
                case "FR38":
                    return 38;
                case "AM38":
                    return 38;
                default:
                    return 37;
            }
        } catch (error) {
            return 2;
        }
    };

    private readonly getStatisticsQ = (p_qty: number): number => {
        try {
            const bSkin: boolean = Object.values(StatisticsQEnum).includes(p_qty);
            return bSkin ? p_qty : StatisticsQEnum.c200;
        } catch (error) {
            return 200;
        }
    };

    /**
     * Processes the periodic sign board configuration.
     *
     * @param p_signBoarId - The ID of the sign board.
     */
    public readonly signBoardConfig = (
        p_signBoarId: string,
        p_configurationEmitter: StsConfigurationInterface | undefined,
        p_tableInterface: StsTableInterface | undefined,
        p_skin: SkinEnum,
    ): MqttTxObservableInterface | undefined => {
        try {
            if (p_configurationEmitter === undefined) return;
            if (p_tableInterface === undefined) return;

            // const bSkin: boolean = Object.values(SkinEnum).includes(p_configurationEmitter.skin as SkinEnum);
            // const strSkin: string = bSkin ? SkinEnum[p_configurationEmitter.skin as SkinEnum] : SkinEnum.BOX;
            const strSkin: string = p_skin as string;
            const skinNumber: number = this.getSkinNumber(strSkin);

            const bType: boolean = Object.values(WheelTypeEnum).includes(p_configurationEmitter.wheelType as WheelTypeEnum);
            const strType: string = bType ? WheelTypeEnum[p_configurationEmitter.wheelType as WheelTypeEnum] : WheelTypeEnum.FR37;
            const typeNumber: number = this.getWheelTypeNumber(strType);
            const tableNumber: string = (p_tableInterface.tableNumber ?? 0).toString();
            const noSmoking: boolean = p_tableInterface.noSmoking ?? true;

            const signBoardLang: string[] = [];
            signBoardLang.push(p_configurationEmitter.lang);
            signBoardLang.push(p_configurationEmitter.lang2);
            signBoardLang.push(p_configurationEmitter.lang3);

            const croupierLang: string[] = [];
            croupierLang.push(p_configurationEmitter.croupierLang);
            croupierLang.push(p_configurationEmitter.croupierLang2);
            croupierLang.push(p_configurationEmitter.croupierLang3);

            const payload = {
                ts: Date.now(),
                roulette_type: typeNumber,
                strType,
                skin: skinNumber,
                tableNumber,
                strSkin,
                noSmoking,
                signBoardLang,
                croupierLang,
                openTime: {
                    ts: Date.now(),
                    left: 0,
                    limit: 0, //300,
                },
            };

            const topic: string = `sts/SignBoard/s/${p_signBoarId}/config`; //JSON.stringify=

            const resp: MqttTxObservableInterface = {
                topic,
                payload: JSON.stringify(payload),
                qos: 0,
                retain: false,
            };
            return resp;
        } catch (error) {
            return;
        }
    };

    public signBoardStatus = (
        p_signBoarId: string,
        p_tableIdEmitter: number | undefined,
        p_configurationEmitter: StsConfigurationInterface | undefined,
        p_winningNumbersEmitter: number[] | undefined,
        p_tableState: RouletteStateEnum,
        p_servicesState: string,
        p_gameNumberEmitter: number | undefined,
    ): MqttTxObservableInterface | undefined => {
        try {
            if (p_tableIdEmitter === undefined) return;
            if (p_configurationEmitter === undefined) return;
            if (p_winningNumbersEmitter === undefined) return;

            const positionsQty: number = this.getNumberOfWheelPositions(p_configurationEmitter.wheelType as WheelTypeEnum);
            const statisticsQ: number = this.getStatisticsQ(p_configurationEmitter.statisticsQ);

            const winningNumbersList: number[] = this.generateWinNumbers(p_tableIdEmitter, p_winningNumbersEmitter, positionsQty, statisticsQ);
            const historicalStatistics: HistoricalStatisticsInterface = this.generateStatsitics(positionsQty, winningNumbersList);
            if (this._statisticsNumbers === undefined) return;

            const statistics: number[] = this._statisticsNumbers ?? [];
            const last_numbers: number[] = p_winningNumbersEmitter ?? [];

            const betConfig = this.getBetConfig(p_configurationEmitter);

            // current state of the services
            const services = p_servicesState; //"HwA";

            // Create the response object
            const msg = this.createResponseObject(p_tableState, last_numbers, statistics, betConfig, historicalStatistics, services, p_gameNumberEmitter);

            // Publish the response to the specified topic
            const resp: MqttTxObservableInterface = {
                topic: `sts/SignBoard/s/${p_signBoarId}/status`,
                payload: JSON.stringify(msg),
                qos: 0,
                retain: false,
            };

            return resp;
        } catch (error) {
            return;
        }
    };
}
