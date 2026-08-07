import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfilesController {
    private readonly profilesService;
    constructor(profilesService: ProfilesService);
    create(createProfileDto: CreateProfileDto): Promise<import("./entities/profile.entity").ProfileEntity>;
    findAll(): Promise<import("./entities/profile.entity").ProfileEntity[]>;
    findOne(id: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: number;
        phone: string | null;
        lastName: string;
    }>;
    update(id: string, updateProfileDto: UpdateProfileDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: number;
        phone: string | null;
        lastName: string;
    }>;
    remove(id: string): string;
}
