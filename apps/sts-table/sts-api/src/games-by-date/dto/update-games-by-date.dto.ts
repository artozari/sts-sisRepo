import { PartialType } from '@nestjs/mapped-types';
import { CreateGamesByDateDto } from './create-games-by-date.dto';

export class UpdateGamesByDateDto extends PartialType(CreateGamesByDateDto) {}
