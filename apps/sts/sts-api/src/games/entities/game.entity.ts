

/**
 * Interface that defines the structure of a game entity.
 *
 * @interface GameInterface
 */
export class GameInterface {
    /**
     * The unique identifier of the game.
     * @type {number}
     */
    id: number;

    /**
     * The date and time when the game was created.
     * @type {Date}
     */
    createdAt: Date;

    /**
     * The date and time when the game was last updated.
     * @type {Date}
     */
    updatedAt: Date;

    /**
     * The game number.
     * @type {number}
     */
    gameNumber: number;

    /**
     * The winning number.
     * @type {number}
     */
    winNumber: number;

    /**
     * The revolutions per minute.
     * @type {number}
     */
    rpm: number;

    /**
     * The clockwise rotation.
     * @type {boolean}
     */
    clockwise: boolean;

    /**
     * The open table status.
     * @type {boolean}
     */
    openTable: boolean;

    /**
     * The enabled status of the game.
     * @type {boolean}
     */
    enabled: boolean;

    /**
     * The identifier of the croupier.
     * @type {number}
     */
    croupierId: number;
}

/**
 * Partial type for the GameInterface.
 * This type is used for partial update of a game.
 * It allows to update only the properties that are provided in the payload.
 *
 * @typedef {Partial<GameInterface>} GamePartialType
 */
export type GamePartialType = Partial<GameInterface>;
