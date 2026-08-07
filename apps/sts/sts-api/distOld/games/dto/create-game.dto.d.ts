import { GameInterface } from "../entities/game.entity";
type CreateGameType = Omit<GameInterface, "id" | "createdAt" | "updatedAt" | "enabled">;
export declare class CreateGameDto implements CreateGameType {
    gameNumber: number;
    winNumber: number;
    rpm: number;
    clockwise: boolean;
    openTable: boolean;
    croupierId: number;
    tableId: number;
}
export {};
