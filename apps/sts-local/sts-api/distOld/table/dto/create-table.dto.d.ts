import { TableEntityClass } from '../entities/table.entity';
type CreateTableType = Omit<TableEntityClass, 'id' | 'createdAt' | 'updatedAt' | 'enabled' | 'lastCutOff'>;
export declare class CreateTableDto implements CreateTableType {
    key: string;
    name: string;
    shortName: string;
    posX: number;
    posY: number;
    layout: number;
    noSmoking: boolean;
    tableNumber: number;
    configTableId: number;
}
export {};
