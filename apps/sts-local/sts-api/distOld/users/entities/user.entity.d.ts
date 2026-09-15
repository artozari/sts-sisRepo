export interface UserEntityInterface {
    id: number;
    email: string;
    password: string;
    enabled: boolean;
    activated: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
