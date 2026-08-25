import { PartialType } from '@nestjs/swagger';
import { CreateCasinoDto } from './create-casino.dto';

export class UpdateCasinoDto extends PartialType(CreateCasinoDto) {}
