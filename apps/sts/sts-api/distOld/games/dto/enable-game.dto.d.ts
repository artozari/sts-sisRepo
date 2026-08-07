import { GameInterface } from "../entities/game.entity";
type EnableGameType = Pick<GameInterface, "enabled">;
export declare class EnableGameDto implements EnableGameType {
    enabled: boolean;
}
export {};
