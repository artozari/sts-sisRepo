import { TypesOfGameEnum } from "../../interfaces/enums/types.of.game.enum";

export interface SignBoardValidatorInterface {
  type: TypesOfGameEnum;
  id: string[];
}
