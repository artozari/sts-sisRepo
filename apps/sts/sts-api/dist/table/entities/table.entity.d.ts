import { CutOffInterface, StsTableInterface } from 'sts-common';
export declare class TableEntityClass implements StsTableInterface {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    key: string;
    name: string;
    shortName: string;
    enabled: boolean;
    noSmoking: boolean;
    tableNumber: number;
    posX: number;
    posY: number;
    layout: number;
    configTableId: number;
    lastCutOff: CutOffInterface | undefined;
}
