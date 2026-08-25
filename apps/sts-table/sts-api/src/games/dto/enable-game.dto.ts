import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean} from "class-validator";
import { GameInterface } from "../entities/game.entity";

type EnableGameType = Pick<GameInterface, "enabled">

export class EnableGameDto implements EnableGameType {

    @ApiProperty({ type: Boolean, example: false, required: true, description: "Used to enable or disable a game." })
    @IsBoolean()
    enabled: boolean;
}





// export class UpdateTableDto extends PartialType(CreateTableDto) {}
