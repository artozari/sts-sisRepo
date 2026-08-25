import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';
import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @ApiProperty({
    type: String,
    required: true,
    example: 'John',
    description: 'User name',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Deere',
    description: 'User lastname',
  })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '+54 11 4308 3456',
    description: 'User phone number',
  })
  @IsOptional()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    type: Number,
    required: true,
    example: 1,
    description: 'User_table identifier',
  })
  @IsOptional()
  @IsString()
  userId: number;
}
