import { CreateGamesByDateDto } from './dto/create-games-by-date.dto';
import { UpdateGamesByDateDto } from './dto/update-games-by-date.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class GamesByDateService {
    private readonly _prismaService;
    constructor(_prismaService: PrismaService);
    create(createGamesByDateDto: CreateGamesByDateDto): string;
    findAll(): string;
    findByDate(dateIni: string, dateEnd: string): import(".prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    findOne(id: number): string;
    update(id: number, updateGamesByDateDto: UpdateGamesByDateDto): string;
    remove(id: number): string;
}
