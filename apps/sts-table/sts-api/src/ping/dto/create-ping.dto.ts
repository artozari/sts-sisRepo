import { IsNumber, IsString } from "class-validator";

export class CreatePingDto {
    @IsString()
    name: string;
    @IsNumber()
    age: number;
}

