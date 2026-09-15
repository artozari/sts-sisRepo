import { TableEntityClass } from '../entities/table.entity';
type UpdateTableType = Omit<Partial<TableEntityClass>, 'id' | 'createdAt' | 'updatedAt' | 'enabled'>;
export declare class UpdateTableDto implements UpdateTableType {
    key: string;
    name: string;
    shortName: string;
    posX: number;
    posY: number;
    layout: number;
    noSmoking: boolean;
    tableNumber: number;
}
export {};
