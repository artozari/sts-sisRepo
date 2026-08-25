import { StsConfigurationInterface, StsGameInterface, StsTableInterface } from "sts-common";

export interface ApiConnectionEmiterInterface {
    tableId: number;
    table: StsTableInterface | undefined;
    gameNumber: number | undefined;
    saveGame: number | undefined;
    winningNumbers: number[] | undefined;
    winningNumbersData: StsGameInterface[] | undefined;
    statistics: number[] | undefined;
    configuration: StsConfigurationInterface | undefined;
    lastSavedGameRecord: StsGameInterface | undefined;
}
