import { UserEntityInterface } from '../entities/user.entity';
type CreateUserType = Omit<UserEntityInterface, 'id' | 'createdAt' | 'updatedAt' | 'enabled' | 'activated'>;
export declare class CreateUserDto implements CreateUserType {
    email: string;
    password: string;
}
export {};
