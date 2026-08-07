import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';
import { UserEntityInterface } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

type UpdateUserType = Omit<
  UserEntityInterface,
  'id' | 'createdAt' | 'updatedAt'
>;
type UpdateUserTypeAux = Partial<UpdateUserType>;

export class UpdateUserDto implements UpdateUserTypeAux {
  @ApiProperty({
    type: String,
    required: false,
    example: 'john.deere@example.com',
    description: 'User email',
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'JohnDeere123.',
    description: 'User email',
  })
  @IsOptional()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minLowercase: 1,
    minSymbols: 1,
  })
  password: string;
  
  @ApiProperty({
    type: Boolean,
    required: false,
    example: 'false',
    description: 'User status enabled',
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
  
  @ApiProperty({
    type: Date,
    required: false,
    example: '2023-04-01T00:00:00.000Z',
    description: 'User activation status',
  })
  @IsOptional()
  @IsDate()
  activated?: Date;
}
