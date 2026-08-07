import { IsOptional, IsPhoneNumber, IsPositive, IsString } from "class-validator";
import { ProfileEntity } from "../entities/profile.entity";
import { ApiProperty } from "@nestjs/swagger";

type CreateProfileType = Omit<
  ProfileEntity,
  'id' | 'createdAt' | 'updatedAt'
>;

export class CreateProfileDto implements CreateProfileType {
  @ApiProperty({
    type: String,
    required: true,
    example: 'John',
    description: 'User name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Deere',
    description: 'User lastname',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '+54 2226 60 3456',
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
  @IsPositive()
  userId: number;
}
