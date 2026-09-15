import { PartialType } from '@nestjs/swagger';
import { CreatePingDto } from './create-ping.dto';

export class UpdatePingDto extends PartialType(CreatePingDto) {}
