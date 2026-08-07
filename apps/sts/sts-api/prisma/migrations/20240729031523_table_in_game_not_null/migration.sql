/*
  Warnings:

  - Made the column `tableId` on table `Game_table` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game_table" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "gameNumber" INTEGER NOT NULL,
    "winNumber" INTEGER NOT NULL,
    "rpm" INTEGER NOT NULL,
    "clockWise" BOOLEAN NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "croupierId" INTEGER,
    "tableId" INTEGER NOT NULL,
    CONSTRAINT "Game_table_croupierId_fkey" FOREIGN KEY ("croupierId") REFERENCES "User_table" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Game_table_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table_table" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Game_table" ("clockWise", "createdAt", "croupierId", "enabled", "gameNumber", "id", "rpm", "tableId", "updatedAt", "winNumber") SELECT "clockWise", "createdAt", "croupierId", "enabled", "gameNumber", "id", "rpm", "tableId", "updatedAt", "winNumber" FROM "Game_table";
DROP TABLE "Game_table";
ALTER TABLE "new_Game_table" RENAME TO "Game_table";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
