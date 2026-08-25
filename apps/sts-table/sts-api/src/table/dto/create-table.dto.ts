import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString, Length, Max, Min } from 'class-validator';
import { TableEntityClass } from '../entities/table.entity';

type CreateTableType = Omit<
  TableEntityClass,
  'id' | 'createdAt' | 'updatedAt' | 'enabled' | 'lastCutOff'
>;

export class CreateTableDto implements CreateTableType {
  @ApiProperty({
    type: String,
    required: true,
    example: 'sts-table__0a002700000e__8020__9020',
    description: 'The key of the table',
  })
  @IsString()
  @Length(20, 50)
  key: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Table 01',
    description: 'The name of the table',
  })
  @ApiProperty({ type: String })
  @IsString()
  @Length(3, 15)
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'T01',
    description: 'The short name of the table',
  })
  @IsString()
  @Length(3, 5)
  shortName: string;

  @ApiProperty({
    type: Number,
    required: true,
    example: -1,
    description: 'Table X position in the casino.',
  })
  @IsInt()
  @Min(-1)
  @Max(5000)
  posX: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: -1,
    description: 'Table Y position in the casino.',
  })
  @IsInt()
  @Min(-1)
  @Max(5000)
  posY: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: -1,
    description: 'Casino layout.',
  })
  @IsInt()
  @Min(0)
  @Max(20)
  layout: number;

  @ApiProperty({
    type: Boolean,
    required: true,
    example: true,
    description: 'Indicate whether smoking is allowed or not.',
  })
  @IsBoolean()
  noSmoking: boolean;

  @ApiProperty({
    type: Number,
    required: true,
    example: 5,
    description: 'Table number (ID)',
  })
  @IsInt()
  @Max(99)
  @Min(0)
  tableNumber: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 1,
    description: 'Configuration table identifier (ID)',
  })
  @IsInt()
  @Min(0)
  configTableId: number;
}
