/*
  Warnings:

  - You are about to drop the column `authorId` on the `Game` table. All the data in the column will be lost.
  - Added the required column `croupierId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "gameNumber" INTEGER NOT NULL,
    "winNumber" INTEGER NOT NULL,
    "rpm" INTEGER NOT NULL,
    "clockWise" BOOLEAN NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "croupierId" INTEGER NOT NULL,
    CONSTRAINT "Game_croupierId_fkey" FOREIGN KEY ("croupierId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("clockWise", "createdAt", "enabled", "gameNumber", "id", "rpm", "updatedAt", "winNumber") SELECT "clockWise", "createdAt", "enabled", "gameNumber", "id", "rpm", "updatedAt", "winNumber" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
