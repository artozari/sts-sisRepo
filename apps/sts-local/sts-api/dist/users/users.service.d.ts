import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class UsersService {
    private readonly _prisma;
    private _salt;
    constructor(_prisma: PrismaService);
    private readonly stringToEncrypt;
    private readonly deleteUserFields;
    onModuleInit(): Promise<void>;
    create: (createUserDto: CreateUserDto) => Promise<unknown>;
    findAll: () => Promise<unknown[]>;
    findOne: (id: number) => Promise<unknown>;
    private readonly setNewPasswordById;
    update: (id: number, updateUserDto: UpdateUserDto) => Promise<unknown>;
    remove(id: number): string;
    findOneByEmail: (email: any) => Promise<unknown>;
    private readonly setNewPasswordByEmail;
    updateByEmail: (email: string, updateUserDto: UpdateUserDto) => Promise<unknown>;
}
