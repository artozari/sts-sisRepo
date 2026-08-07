import { StsCasinoInterface } from "sts-common";
import { ApiConnectionEmiterInterface } from "../api/interfaces/api.connection.emiter.interface";

export interface DashBoardClassDataInterface extends ApiConnectionEmiterInterface {
  casino: StsCasinoInterface | undefined;
  ts: number;
}
