/**
 * @interface KeyboardDriverInterface
 * @description Interface that represents the structure of a keyboard event.
 * @property {number} key - The key code of the key that was pressed or released.
 * @property {boolean} action - A boolean indicating if the key was pressed (true) or released (false).
 * @property {number} time - A timestamp indicating when the key was pressed or released.
 */
export interface KeyboardDriverInterface {
  key: number;
  action: boolean;
  time: number;
}
