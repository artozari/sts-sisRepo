import { ProfileEntity } from "../entities/profile.entity";
type CreateProfileType = Omit<ProfileEntity, 'id' | 'createdAt' | 'updatedAt'>;
export declare class CreateProfileDto implements CreateProfileType {
    name: string;
    lastName: string;
    phone: string;
    userId: number;
}
export {};
