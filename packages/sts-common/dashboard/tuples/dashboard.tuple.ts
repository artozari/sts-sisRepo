
/**
 * Elements of the dashboard tuple: ["id", "createdAt", "gameNumber", "winNumber", "rpm", "clockwise", "openTable", "enabled", "croupierId", "tableId"]
 */

export type DashBoardTuple = [number, Date, number, number, number, boolean, boolean, boolean, number | null, number];
