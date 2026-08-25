import { IsEmail, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntityInterface } from '../entities/user.entity';

type CreateUserType = Omit<
  UserEntityInterface,
  'id' | 'createdAt' | 'updatedAt' | 'enabled' | 'activated'
>;

export class CreateUserDto implements CreateUserType {
  @ApiProperty({
    type: String,
    required: true,
    example: 'john.deere@example.com',
    description: 'User email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'JohnDeere123.',
    description: 'User email',
  })
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minLowercase: 1,
    minSymbols: 1,
  })
  password: string;
}
