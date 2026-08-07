import { IsBoolean, IsInt, IsOptional, Max, Min } from "class-validator";
import { GameInterface } from "../entities/game.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";


type CreateGameType = Omit<GameInterface, "id" | "createdAt" | "updatedAt" | "enabled">

export class CreateGameDto implements CreateGameType {

    @ApiProperty({ type: Number, required: true, example: 1, description: 'Game number' })
    @IsInt()
    @Min(0)
    gameNumber: number;

    @ApiProperty({ type: Number, required: true, example: 1, description: 'Win number of a game' })
    @IsInt()
    @Min(0)
    @Max(37)
    winNumber: number;

    @ApiProperty({ type: Number, required: true, example: 1, description: 'Revolution per minute' })
    @IsInt()
    @Min(0)
    @Max(50)
    rpm: number;

    @ApiProperty({ type: Number, required: true, example: true, description: 'Clockwise direction' })
    @IsBoolean()
    clockwise: boolean;

    @ApiProperty({ type: Number, required: true, example: true, description: 'Open table status' })
    @IsBoolean()
    openTable: boolean;

    @ApiPropertyOptional({ type: Number, required: false, example: 1, description: 'Croupier identifier' })
    @IsOptional()
    @IsInt()
    @Min(1)
    croupierId: number;

    @ApiProperty({ type: Number, required: true, example: 1, description: 'Table identifier' })
    @IsInt()
    @Min(1)
    tableId: number;
}
