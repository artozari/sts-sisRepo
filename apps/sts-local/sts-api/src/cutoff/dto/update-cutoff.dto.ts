import { PartialType } from '@nestjs/mapped-types';
import { CreateCutoffDto } from './create-cutoff.dto';

export class UpdateCutoffDto extends PartialType(CreateCutoffDto) {}
