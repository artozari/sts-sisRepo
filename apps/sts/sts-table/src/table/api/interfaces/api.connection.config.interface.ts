import { GeneralLoggerClass } from "@slcn-pkg/general-logger-class";
import { ApiConnectionEmiterEnum } from "../enums/api.connection.emiter.enum";
import { ApiConnectionEmiterInterface } from "./api.connection.emiter.interface";
import { CutOffInterface } from "sts-common";

export interface ApiConnectionConfigInterface {
    url: string;
    port: number;
    ssl: boolean;
    version: string;
    tableId: string;
    timeout: number;
    logger: GeneralLoggerClass | null;
    getGameEmision: (p_typeEmission: ApiConnectionEmiterEnum, p_result: ApiConnectionEmiterInterface) => void;
    getCutOff: (p_cutOff: CutOffInterface) => void;
}
