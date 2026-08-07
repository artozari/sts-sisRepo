/*
  Warnings:

  - You are about to drop the column `tableId` on the `Config_table` table. All the data in the column will be lost.
  - Added the required column `configTableId` to the `Table_table` table without a default value. This is not possible if the table is not empty.

*/
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
    "skin" TEXT NOT NULL DEFAULT 'BOX',
    "skin2" TEXT NOT NULL DEFAULT 'BALL',
    "skin3" TEXT NOT NULL DEFAULT 'LIGHT_NEON_PINK',
    "skin4" TEXT NOT NULL DEFAULT 'CHINESE_96',
    "skin5" TEXT NOT NULL DEFAULT 'RACING',
    "skin6" TEXT NOT NULL DEFAULT 'OFF',
    "skin7" TEXT NOT NULL DEFAULT 'OFF',
    "skin8" TEXT NOT NULL DEFAULT 'OFF',
    "lang" TEXT NOT NULL DEFAULT 'es',
    "lang2" TEXT NOT NULL DEFAULT 'OFF',
    "lang3" TEXT NOT NULL DEFAULT 'OFF',
    "croupierLang" TEXT NOT NULL DEFAULT 'es',
    "croupierLang2" TEXT NOT NULL DEFAULT 'OFF',
    "croupierLang3" TEXT NOT NULL DEFAULT 'OFF',
    "skinRotationTime" INTEGER NOT NULL DEFAULT 60,
    "statisticsQ" INTEGER NOT NULL DEFAULT 200,
    "colorOfLights" TEXT NOT NULL DEFAULT 'yellow',
    "lightsIntensity" INTEGER NOT NULL DEFAULT 1,
    "semaphoreIntensity" INTEGER NOT NULL DEFAULT 1,
    "semaphoreTime" INTEGER NOT NULL DEFAULT 15,
    "semaphoreGreen" INTEGER NOT NULL DEFAULT 4,
    "semaphoreYellow" INTEGER NOT NULL DEFAULT 2,
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
    CONSTRAINT "Config_table_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User_table" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Config_table" ("b12", "b18", "b36", "b6", "b7", "b9", "bCha1", "bCha2", "chip", "colorOfLights", "createdAt", "croupierLang", "croupierLang2", "croupierLang3", "description", "enabled", "id", "lang", "lang2", "lang3", "lightsIntensity", "max", "min", "semaphoreGreen", "semaphoreIntensity", "semaphoreTime", "semaphoreYellow", "skin", "skin2", "skin3", "skin4", "skin5", "skin6", "skin7", "skin8", "skinRotationTime", "statisticsQ", "updatedAt", "userId", "wheelType") SELECT "b12", "b18", "b36", "b6", "b7", "b9", "bCha1", "bCha2", "chip", "colorOfLights", "createdAt", "croupierLang", "croupierLang2", "croupierLang3", "description", "enabled", "id", "lang", "lang2", "lang3", "lightsIntensity", "max", "min", "semaphoreGreen", "semaphoreIntensity", "semaphoreTime", "semaphoreYellow", "skin", "skin2", "skin3", "skin4", "skin5", "skin6", "skin7", "skin8", "skinRotationTime", "statisticsQ", "updatedAt", "userId", "wheelType" FROM "Config_table";
DROP TABLE "Config_table";
ALTER TABLE "new_Config_table" RENAME TO "Config_table";
CREATE TABLE "new_Table_table" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "posX" INTEGER NOT NULL DEFAULT -1,
    "posY" INTEGER NOT NULL DEFAULT -1,
    "layout" INTEGER NOT NULL DEFAULT 0,
    "noSmoking" BOOLEAN NOT NULL DEFAULT true,
    "tableNumber" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "configTableId" INTEGER NOT NULL,
    CONSTRAINT "Table_table_configTableId_fkey" FOREIGN KEY ("configTableId") REFERENCES "Config_table" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Table_table" ("createdAt", "enabled", "id", "key", "layout", "name", "noSmoking", "posX", "posY", "shortName", "tableNumber", "updatedAt") SELECT "createdAt", "enabled", "id", "key", "layout", "name", "noSmoking", "posX", "posY", "shortName", "tableNumber", "updatedAt" FROM "Table_table";
DROP TABLE "Table_table";
ALTER TABLE "new_Table_table" RENAME TO "Table_table";
CREATE UNIQUE INDEX "Table_table_key_key" ON "Table_table"("key");
CREATE UNIQUE INDEX "Table_table_name_key" ON "Table_table"("name");
CREATE UNIQUE INDEX "Table_table_shortName_key" ON "Table_table"("shortName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
