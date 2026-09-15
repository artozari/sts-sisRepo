-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Table_table" ("createdAt", "enabled", "id", "key", "layout", "name", "noSmoking", "posX", "posY", "shortName", "updatedAt") SELECT "createdAt", "enabled", "id", "key", "layout", "name", "noSmoking", "posX", "posY", "shortName", "updatedAt" FROM "Table_table";
DROP TABLE "Table_table";
ALTER TABLE "new_Table_table" RENAME TO "Table_table";
CREATE UNIQUE INDEX "Table_table_key_key" ON "Table_table"("key");
CREATE UNIQUE INDEX "Table_table_name_key" ON "Table_table"("name");
CREATE UNIQUE INDEX "Table_table_shortName_key" ON "Table_table"("shortName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
