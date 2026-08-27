import { CreateCutoffDto } from './dto/create-cutoff.dto';
import { UpdateCutoffDto } from './dto/update-cutoff.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class CutoffService {
    private readonly _prismaService;
    constructor(_prismaService: PrismaService);
    create(createCutoffDto: CreateCutoffDto): import(".prisma/client").Prisma.Prisma__Cutoff_tableClient<{
        id: number;
        enable: boolean;
        key: string;
        time: Date;
        create_at: Date;
        tick: Date;
        liberado: string | null;
        hash: string | null;
        attempts: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        enable: boolean;
        key: string;
        time: Date;
        create_at: Date;
        tick: Date;
        liberado: string | null;
        hash: string | null;
        attempts: number;
    }[]>;
    findLastCutoff(): Promise<{
        enabled: {
            id: number;
            enable: boolean;
            key: string;
            time: Date;
            create_at: Date;
            tick: Date;
            liberado: string | null;
            hash: string | null;
            attempts: number;
        };
        disabled: {
            id: number;
            enable: boolean;
            key: string;
            time: Date;
            create_at: Date;
            tick: Date;
            liberado: string | null;
            hash: string | null;
            attempts: number;
        };
    }>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__Cutoff_tableClient<{
        id: number;
        enable: boolean;
        key: string;
        time: Date;
        create_at: Date;
        tick: Date;
        liberado: string | null;
        hash: string | null;
        attempts: number;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateCutoffDto: UpdateCutoffDto): import(".prisma/client").Prisma.Prisma__Cutoff_tableClient<{
        id: number;
        enable: boolean;
        key: string;
        time: Date;
        create_at: Date;
        tick: Date;
        liberado: string | null;
        hash: string | null;
        attempts: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions> | {
        error: string;
    };
    remove(id: number): string;
}
