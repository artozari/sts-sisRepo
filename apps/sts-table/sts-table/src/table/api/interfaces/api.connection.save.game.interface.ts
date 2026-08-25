export interface ApiConnectionSaveGameInterface {
  gameNumber: number;
  winNumber: number;
  rpm: number;
  clockwise: boolean;
  openTable: boolean;
  croupierId: number | undefined;
  tableId: number;
}
