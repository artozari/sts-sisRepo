export interface UserEntityInterface {
  id: number;
  email: string;
  password: string;
  enabled: boolean;
  activated: Date | null;
  // role    Role     @default(USER)
  createdAt: Date;
  updatedAt: Date;
}
