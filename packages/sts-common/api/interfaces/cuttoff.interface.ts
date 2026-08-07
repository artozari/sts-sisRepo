export interface LastCutOffInterface {
    enabled: CutOffInterface;
    disabled: CutOffInterface;
}

export interface CutOffInterface {
    id: number;
    time: string;
    key: string;
    create_at: string;
    enable: boolean;
    tick: string;
    liberado: string;
    hash: string;
    attempts: number;
}
