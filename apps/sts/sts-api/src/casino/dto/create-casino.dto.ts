import { ApiProperty } from '@nestjs/swagger';
import { CasinoEntityInterface } from '../entities/casino.entity';
import {
  IsBoolean,
  IsEnum,
  IsISO31661Alpha3,
  IsPort,
  IsString,
  IsStrongPassword,
  IsUrl,
  Length,
} from 'class-validator';

type CreateCasinoType = Omit<
  CasinoEntityInterface,
  'id' | 'createdAt' | 'updatedAt'
>;

export class CreateCasinoDto implements CreateCasinoType {
  @ApiProperty({
    type: String,
    required: true,
    example: 'CA_SLCN',
    description: 'Casino code (identifier)',
  })
  @IsString()
  @Length(3, 10)
  casinoCode: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Casino Sielcon',
    description: 'Casino name',
  })
  @IsString()
  @Length(3, 25)
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'ARG',
    description: 'Casino country',
  })
  @IsISO31661Alpha3()
  country: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'CABA',
    description: 'Casino province',
  })
  @IsString()
  @Length(2, 50)
  province: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Ciudad Autónoma de Buenos Aires',
    description: 'Casino city',
  })
  @IsString()
  @Length(2, 50)
  city: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Camarones 2840',
    description: 'Casino address',
  })
  @IsString()
  @Length(2, 50)
  address: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'sielcondev01.site',
    description: 'MQTT broker URL.',
  })
  @IsUrl()
  mqtt_url: string;

  @ApiProperty({
    type: String,
    required: true,
    example: "9105",
    description: 'MQTT broker Port.',
  })
  @IsPort()
  mqtt_port: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'ws',
    description: 'MQTT protocol',
  })
  @IsEnum(['mqtt', 'ws'], {
    message:
      "The property 'mqtt_protocol' must be one of the following values: 'mqtt' or 'ws'.",
  })
  mqtt_protocol: string;

  @ApiProperty({
    type: Boolean,
    required: true,
    example: false,
    description: 'TLS or not',
  })
  @IsBoolean()
  mqtt_tls: boolean;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Hernan',
    description: 'MQTT user',
  })
  @IsString()
  @Length(6, 15)
  mqtt_user: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Hap1357.',
    description: 'MQTT password',
  })
  @IsStrongPassword()
  mqtt_password: string;

  @ApiProperty({
    type: Number,
    required: true,
    example: 10,
    description: 'MQTT refresh time in seconds',
  })
  @IsEnum([5, 10, 15, 20, 25, 30, 45, 60])
  mqtt_refresh_time_msec: number;
}
