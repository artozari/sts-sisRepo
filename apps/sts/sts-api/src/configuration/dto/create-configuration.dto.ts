import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConfigurationEntityInterface } from '../entities/configuration.entity';
import {
  ColorOfLightsEnum,
  SkinEnum,
  SkinOffArray,
  SkinOffType,
  SkinRotationTimeArray,
  StatisticsQEnum,
  WheelTypeEnum,
} from 'sts-common';
import { LANGSCODES, LANGSCODES_OFF } from '@slcn-pkg/languages-class';

type CreateConfigurationType = Omit<
  ConfigurationEntityInterface,
  'id' | 'createdAt' | 'updatedAt' | 'enabled'
>;

export class CreateConfigurationDto implements CreateConfigurationType {
  @ApiProperty({
    type: Number,
    required: true,
    example: 4,
    description: 'Maximum intensity of lights',
  })
  @IsInt()
  @Max(10)
  @Min(0)
  lightsIntensity: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 5,
    description: 'Maximum semaphore intensity',
  })
  @IsInt()
  @Max(10)
  @Min(0)
  semaphoreIntensity: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 5,
    description: 'Time interval for analyzing the semaphore.',
  })
  @IsInt()
  @Max(30)
  @Min(5)
  semaphoreTime: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 5,
    description: 'Green level to analyze the semaphore in the time interval.',
  })
  @IsInt()
  @Max(30)
  @Min(2)
  semaphoreGreen: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 5,
    description: 'Yellow level to analyze the semaphore in the time interval.',
  })
  @IsInt()
  @Max(30)
  @Min(1)
  semaphoreYellow: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 200,
    description: 'Number of samples for statistics',
  })
  @IsEnum(StatisticsQEnum)
  statisticsQ: StatisticsQEnum;

  @ApiProperty({
    type: String,
    required: true,
    example: 'green',
    description: 'Color of lights',
  })
  @IsEnum(ColorOfLightsEnum)
  colorOfLights: ColorOfLightsEnum;

  @ApiProperty({
    type: String,
    required: true,
    example: 'BOX',
    description: 'Screen skin 1',
  })
  @IsEnum(SkinEnum)
  skin: SkinEnum;

  @ApiProperty({
    type: String,
    required: true,
    example: 'BALL',
    description: 'Screen skin 2',
  })
  @IsIn(SkinOffArray)
  skin2: SkinOffType;

  @ApiProperty({
    type: String,
    required: true,
    example: 'LIGHT_NEON_PINK',
    description: 'Screen skin 3',
  })
  @IsIn(SkinOffArray)
  skin3: SkinOffType;

  @ApiProperty({
    type: String,
    required: true,
    example: 'CHINESE_96',
    description: 'Screen skin 4',
  })
  @IsIn(SkinOffArray)
  skin4: SkinOffType;

  @ApiProperty({
    type: String,
    required: true,
    example: 'RACING',
    description: 'Screen skin 5',
  })
  @IsEnum(SkinOffArray)
  skin5: SkinOffType;

  @ApiProperty({
    type: String,
    required: true,
    example: 'OFF',
    description: 'Screen skin 6',
  })
  @IsEnum(SkinOffArray)
  skin6: SkinOffType;

  @ApiProperty({
    type: String,
    required: true,
    example: 'OFF',
    description: 'Screen skin 7',
  })
  @IsEnum(SkinOffArray)
  skin7: SkinOffType;

  @ApiProperty({
    type: String,
    required: true,
    example: 'OFF',
    description: 'Screen skin 8',
  })
  @IsEnum(SkinOffArray)
  skin8: SkinOffType;

  @ApiProperty({
    type: Number,
    required: true,
    example: 60,
    description: 'Skin rotation time',
  })
  @IsInt()
  @IsIn(SkinRotationTimeArray)
  skinRotationTime: number;

  @ApiProperty({
    type: String,
    required: true,
    example: 'FR37',
    description: 'Wheel type',
  })
  @IsEnum(WheelTypeEnum)
  wheelType: WheelTypeEnum;

  @ApiProperty({
    type: Number,
    required: true,
    example: 1000000,
    description: 'Maximum bet in cents',
  })
  @IsInt()
  @Min(1)
  max: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 1000,
    description: 'Minimum bet in cents',
  })
  @IsInt()
  @Min(1)
  min: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 1000,
    description: 'Chip value',
  })
  @IsInt()
  @Min(1)
  @Max(100000000)
  chip: number;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Regular table configuration.',
    description: 'Configuration description',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    type: Number,
    required: true,
    example: 1000,
    description: 'Maximum bet for payouts of 36',
  })
  @IsInt()
  @Min(1)
  @Max(1000000)
  b36: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 2000,
    description: 'Maximum bet for payouts of 18',
  })
  @IsInt()
  @Min(1)
  @Max(1000000)
  b18: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 3000,
    description: 'Maximum bet for payouts of 12',
  })
  @IsInt()
  @Min(1)
  @Max(1000000)
  b12: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 4000,
    description: 'Maximum bet for payouts of 9',
  })
  @IsInt()
  @Min(1)
  @Max(1000000)
  b9: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 5000,
    description: 'Maximum bet for payouts of 7',
  })
  @IsInt()
  @Min(1)
  @Max(1000000)
  b7: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 6000,
    description: 'Maximum bet for payouts of 6',
  })
  @IsInt()
  @Min(1)
  @Max(1000000)
  b6: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 30000,
    description: 'Maximum bet for payouts of cha1 (simple)',
  })
  @IsInt()
  @Min(1)
  @Max(1000000)
  bCha1: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 20000,
    description: 'Maximum bet for payouts of cha2 (doble)',
  })
  @IsInt()
  @Min(1)
  @Max(1000000)
  bCha2: number;

  @ApiPropertyOptional({
    type: Number,
    required: false,
    example: 1,
    description: 'User identifier',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({
    type: String,
    required: true,
    example: 'es',
    description: 'Active Language Identifier',
  })
  @IsIn(LANGSCODES)
  lang: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'es',
    description: 'Active Language Identifier 2',
  })
  @IsIn(LANGSCODES_OFF)
  lang2: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'OFF',
    description: 'Active Language Identifier 3',
  })
  @IsIn(LANGSCODES_OFF)
  lang3: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'es',
    description: 'Active Language Identifier',
  })
  @IsIn(LANGSCODES)
  croupierLang: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'es',
    description: 'Active Language Identifier 2',
  })
  @IsIn(LANGSCODES_OFF)
  croupierLang2: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'OFF',
    description: 'Active Language Identifier 3',
  })
  @IsIn(LANGSCODES_OFF)
  croupierLang3: string;
}
