
import { IsBoolean, IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { GamePartialType } from '../entities/game.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';


type UpdateGameType = Omit<GamePartialType, 'id' | 'createdAt' | 'updatedAt' | 'enabled'>

export class UpdateGameDto implements UpdateGameType {

    @ApiPropertyOptional({ type: Number, required: false, example: 1, description: 'Game number' })
    @IsOptional()
    @IsInt()
    @Min(0)
    gameNumber: number;

    @ApiPropertyOptional({ type: Number, required: false, example: 1, description: 'Win number of a game' })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(37)
    winNumber: number;

    @ApiPropertyOptional({ type: Number, required: false, nullable: true, example: 0.303, description: 'Revolution per minute (nullable)' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    rpm: number | null;

    @ApiPropertyOptional({ type: Number, required: false, example: true, description: 'Clockwise direction' })
    @IsOptional()
    @IsBoolean()
    clockwise: boolean;

    @ApiPropertyOptional({ type: Number, required: false, example: true, description: 'Open table status' })
    @IsOptional()
    @IsBoolean()
    openTable: boolean;

    @ApiPropertyOptional({ type: Number, required: false, example: 1, description: 'Croupier identifier' })
    @IsOptional()
    @IsInt()
    @Min(1)
    croupierId: number;

    @ApiPropertyOptional({ type: Number, required: false, example: 1, description: 'Table identifier' })
    @IsOptional()
    @IsInt()
    @Min(1)
    tableId: number;
}
