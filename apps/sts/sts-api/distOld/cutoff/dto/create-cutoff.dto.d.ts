import { CutOffInterface } from 'sts-common';
export declare class CreateCutoffDto implements CutOffInterface {
    id: number | null;
    time: string;
    key: string;
    create_at: string;
    enable: boolean;
    tick: string;
    liberado: string;
    hash: string;
    attempts: number;
}
