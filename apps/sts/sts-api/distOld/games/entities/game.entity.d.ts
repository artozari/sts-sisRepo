export declare class GameInterface {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    gameNumber: number;
    winNumber: number;
    rpm: number;
    clockwise: boolean;
    openTable: boolean;
    enabled: boolean;
    croupierId: number;
}
export type GamePartialType = Partial<GameInterface>;
