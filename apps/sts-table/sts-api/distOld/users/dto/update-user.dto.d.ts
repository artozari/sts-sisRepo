import { UserEntityInterface } from '../entities/user.entity';
type UpdateUserType = Omit<UserEntityInterface, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateUserTypeAux = Partial<UpdateUserType>;
export declare class UpdateUserDto implements UpdateUserTypeAux {
    email: string;
    password: string;
    enabled?: boolean;
    activated?: Date;
}
export {};
