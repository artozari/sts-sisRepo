import { SkinEnum } from "../enums/skin.enum";

enum OffEnum {
  OFF = "OFF",
}

export type SkinOffType = OffEnum | SkinEnum;

export const SkinOffArray: string[] = (Object.values(OffEnum) as string[]).concat(Object.values(SkinEnum));
