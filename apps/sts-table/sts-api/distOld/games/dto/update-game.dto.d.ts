import { GamePartialType } from '../entities/game.entity';
type UpdateGameType = Omit<GamePartialType, 'id' | 'createdAt' | 'updatedAt' | 'enabled'>;
export declare class UpdateGameDto implements UpdateGameType {
    gameNumber: number;
    winNumber: number;
    rpm: number;
    clockwise: boolean;
    openTable: boolean;
    croupierId: number;
    tableId: number;
}
export {};
