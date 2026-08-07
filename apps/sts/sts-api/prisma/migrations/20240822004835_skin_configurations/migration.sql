-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Config_table" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "wheelType" TEXT NOT NULL DEFAULT 'FR37',
    "skin" TEXT NOT NULL DEFAULT 'SKIN_F1',
    "statisticsQ" INTEGER NOT NULL DEFAULT 200,
    "colorOfLights" TEXT NOT NULL DEFAULT 'yellow',
    "lightsIntensity" INTEGER NOT NULL DEFAULT 1,
    "semaphoreIntensity" INTEGER NOT NULL DEFAULT 1,
    "tableNumber" INTEGER NOT NULL DEFAULT 0,
    "max" INTEGER NOT NULL,
    "min" INTEGER NOT NULL,
    "chip" INTEGER NOT NULL,
    "b36" INTEGER NOT NULL,
    "b18" INTEGER NOT NULL,
    "b12" INTEGER NOT NULL,
    "b9" INTEGER NOT NULL,
    "b6" INTEGER NOT NULL,
    "b7" INTEGER NOT NULL,
    "bCha1" INTEGER NOT NULL,
    "bCha2" INTEGER NOT NULL,
    "userId" INTEGER,
    "tableId" INTEGER NOT NULL,
    CONSTRAINT "Config_table_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User_table" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Config_table_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table_table" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Config_table" ("b12", "b18", "b36", "b6", "b7", "b9", "bCha1", "bCha2", "chip", "colorOfLights", "createdAt", "description", "enabled", "id", "lightsIntensity", "max", "min", "semaphoreIntensity", "statisticsQ", "tableId", "tableNumber", "updatedAt", "userId", "wheelType") SELECT "b12", "b18", "b36", "b6", "b7", "b9", "bCha1", "bCha2", "chip", "colorOfLights", "createdAt", "description", "enabled", "id", "lightsIntensity", "max", "min", "semaphoreIntensity", "statisticsQ", "tableId", "tableNumber", "updatedAt", "userId", "wheelType" FROM "Config_table";
DROP TABLE "Config_table";
ALTER TABLE "new_Config_table" RENAME TO "Config_table";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
