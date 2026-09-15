import { TableEntityClass } from '../entities/table.entity';
type EnableTableType = Pick<TableEntityClass, "enabled">;
export declare class EnableTableDto implements EnableTableType {
    enabled: boolean;
}
export {};
