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
    "croupierId" INTEGER,
    CONSTRAINT "Game_croupierId_fkey" FOREIGN KEY ("croupierId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("clockWise", "createdAt", "croupierId", "enabled", "gameNumber", "id", "rpm", "updatedAt", "winNumber") SELECT "clockWise", "createdAt", "croupierId", "enabled", "gameNumber", "id", "rpm", "updatedAt", "winNumber" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
