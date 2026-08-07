"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_format_1 = __importDefault(require("./morgan.format"));
class MorganClass {
    constructor() {
        this.minFilesDefault = 5;
        this.maxFilesDefault = 20;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.skip = (p_param) => {
            let skip;
            try {
                if (typeof p_param === "string") {
                    const param = p_param.trim().toLowerCase();
                    if (param === "true")
                        p_param = true;
                    else if (param === "false")
                        p_param = false;
                }
                if (p_param === true)
                    skip = true;
                else if (p_param === false)
                    skip = false;
                else
                    skip = false;
            }
            catch (error) {
                skip = false;
            }
            return skip;
        };
        this.format = (p_param) => {
            try {
                let sal = morgan_format_1.default[0];
                const formatCFG = p_param.trim().toLowerCase();
                const resp = morgan_format_1.default.includes(formatCFG);
                if (resp === true)
                    sal = formatCFG;
                return sal;
            }
            catch (error) {
                return morgan_format_1.default[0];
            }
        };
        this.maxFiles = (p_param) => {
            try {
                let sal;
                const resp = Number(p_param);
                if (resp < this.minFilesDefault)
                    sal = this.minFilesDefault;
                else if (resp > this.maxFilesDefault)
                    sal = this.maxFilesDefault;
                else
                    sal = resp;
                return sal;
            }
            catch (error) {
                return this.maxFilesDefault;
            }
        };
    }
}
exports.default = MorganClass;
