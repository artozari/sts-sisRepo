import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean,  IsOptional} from "class-validator";
import { TableEntityClass } from '../entities/table.entity';

type EnableTableType = Pick<TableEntityClass, "enabled">

export class EnableTableDto implements EnableTableType {

    @ApiProperty({ type: Boolean, example: false, required: true, description: "Used to enable or disable a table." })
    @IsBoolean()
    @IsOptional()
    enabled: boolean;
}





// export class UpdateTableDto extends PartialType(CreateTableDto) {}
