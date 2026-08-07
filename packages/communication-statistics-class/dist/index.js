"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunicationStatisticsClass = void 0;
class CommunicationStatisticsClass {
    constructor(p_time, _amount) {
        this._amount = _amount;
        this._historicalData = [];
        this._data = {};
        this.clearStatistics = () => {
            this._data.minTime = 0;
            this._data.maxTime = 0;
            this._data.totalTime = 0;
            this._data.meterOk = 0;
            this._data.meterError = 0;
        };
        this.periodic = () => {
            try {
                this._historicalData.unshift({ ...this._data });
                this._historicalData.slice(0, this._amount);
                this.clearStatistics();
                //   this._historicalData.forEach(
                //     (data: CommunicationStatisticsInterface, index: number) => {
                //       console.log(
                //         `${index}) Max=${data.maxTime} Min=${data.minTime} Tot=${data.totalTime} Ok=${data.meterOk} Err=${data.meterError} Avg=${data.meterOk ? data.totalTime / data.meterOk : 0}`
                //       );
                // }
                //   );
            }
            catch (error) {
                // empty
            }
        };
        this.newData = (p_ok, p_time) => {
            try {
                if (p_ok && p_time >= 0) {
                    this._data.meterOk++;
                    this._data.totalTime += p_time;
                    if (this._data.minTime == 0 || this._data.minTime > p_time) {
                        this._data.minTime = p_time;
                    }
                    if (this._data.maxTime < p_time) {
                        this._data.maxTime = p_time;
                    }
                }
                else
                    this._data.meterError++;
            }
            catch (error) {
                // empty
            }
        };
        this.getCurrent = () => {
            return this._data;
        };
        this.getHistorical = () => {
            return this._historicalData;
        };
        this.clearStatistics();
        setInterval(this.periodic, 1000 * p_time);
    }
}
exports.CommunicationStatisticsClass = CommunicationStatisticsClass;
