import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { EnableGameDto } from './dto/enable-game.dto';
export declare class GamesController {
    private readonly gamesService;
    constructor(gamesService: GamesService);
    create(createGameDto: CreateGameDto): Promise<CreateGameDto>;
    findAll(q: string, table: string, enabled: string): Promise<unknown>;
    findOne(id: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        enabled: boolean;
        gameNumber: number;
        winNumber: number;
        rpm: number;
        clockwise: boolean;
        openTable: boolean;
        croupierId: number | null;
        tableId: number;
    }>;
    update(id: string, updateGameDto: UpdateGameDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        enabled: boolean;
        gameNumber: number;
        winNumber: number;
        rpm: number;
        clockwise: boolean;
        openTable: boolean;
        croupierId: number | null;
        tableId: number;
    }>;
    enable(id: string, enableGameDto: EnableGameDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        enabled: boolean;
        gameNumber: number;
        winNumber: number;
        rpm: number;
        clockwise: boolean;
        openTable: boolean;
        croupierId: number | null;
        tableId: number;
    }>;
}
