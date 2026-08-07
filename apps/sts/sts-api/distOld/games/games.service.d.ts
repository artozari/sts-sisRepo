import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnableGameDto } from './dto/enable-game.dto';
import { GameInterface } from './entities/game.entity';
export declare class GamesService {
    private _prisma;
    constructor(_prisma: PrismaService);
    create(createGameDto: CreateGameDto): Promise<CreateGameDto>;
    findAll: (q: number, table: number, enabledQuery: string) => Promise<GameInterface[]>;
    findOne: (id: number) => Promise<{
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
    update(id: number, updateGameDto: UpdateGameDto): Promise<{
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
    enabled: (id: number, enableGameDto: EnableGameDto) => Promise<{
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
