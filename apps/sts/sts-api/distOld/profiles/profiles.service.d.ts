import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileEntity } from './entities/profile.entity';
export declare class ProfilesService {
    private readonly _prisma;
    constructor(_prisma: PrismaService);
    create: (createProfileDto: CreateProfileDto) => Promise<ProfileEntity>;
    findAll: () => Promise<ProfileEntity[]>;
    findOne: (id: number) => Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: number;
        phone: string | null;
        lastName: string;
    }>;
    update: (id: number, updateUserDto: UpdateProfileDto) => Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: number;
        phone: string | null;
        lastName: string;
    }>;
    remove(id: number): string;
}
