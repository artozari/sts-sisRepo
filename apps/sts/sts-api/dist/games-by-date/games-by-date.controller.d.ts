import { GamesByDateService } from './games-by-date.service';
export declare class GamesByDateController {
    private readonly gamesByDateService;
    constructor(gamesByDateService: GamesByDateService);
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
    findOne(id: string): string;
}
