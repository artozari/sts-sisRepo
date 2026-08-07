import { CutOffInterface } from 'sts-common';

export class CreateCutoffDto implements CutOffInterface {
  id: number | null; // INTEGER
  time: string; // DATETIME
  key: string; // TEXT
  create_at: string; // DATETIME
  enable: boolean; // BOOLEAN
  tick: string; // DATETIME
  liberado: string; // TEXT
  hash: string; // TEXT
  attempts: number; // INTEGER
}
