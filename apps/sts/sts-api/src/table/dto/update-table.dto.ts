import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { TableEntityClass } from '../entities/table.entity';

type UpdateTableType = Omit<
  Partial<TableEntityClass>,
  'id' | 'createdAt' | 'updatedAt' | 'enabled'
>;

export class UpdateTableDto implements UpdateTableType {
  @ApiPropertyOptional({
    type: String,
    required: false,
    example: 'sts-table__0a002700000e__8020__9020',
    description: 'The key of the table',
  })
  @IsString()
  @Length(20, 50)
  @IsOptional()
  key: string;

  @ApiPropertyOptional({
    type: String,
    required: false,
    example: 'Table 01',
    description: 'The name of the table',
  })
  @IsString()
  @Length(3, 15)
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    type: String,
    required: false,
    example: 'T01',
    description: 'The short name of the table',
  })
  @IsString()
  @Length(3, 5)
  @IsOptional()
  shortName: string;

  // --------------------------------------------------------

  @ApiPropertyOptional({
    type: Number,
    required: true,
    example: -1,
    description: 'Table X position in the casino.',
  })
  @IsInt()
  @Min(-1)
  @Max(5000)
  posX: number;

  @ApiPropertyOptional({
    type: Number,
    required: true,
    example: -1,
    description: 'Table Y position in the casino.',
  })
  @IsInt()
  @Min(-1)
  @Max(5000)
  posY: number;

  @ApiPropertyOptional({
    type: Number,
    required: true,
    example: -1,
    description: 'Casino layout.',
  })
  @IsInt()
  @Min(0)
  @Max(20)
  layout: number;

  @ApiPropertyOptional({
    type: Boolean,
    required: true,
    example: true,
    description: 'Indicate whether smoking is allowed or not.',
  })
  @IsBoolean()
  noSmoking: boolean;

  @ApiPropertyOptional({
    type: Number,
    required: true,
    example: 5,
    description: 'Table number (ID)',
  })
  @IsInt()
  @Max(99)
  @Min(0)
  tableNumber: number;
}
