-- CreateTable
CREATE TABLE "Table_table" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Table_table_key_key" ON "Table_table"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Table_table_name_key" ON "Table_table"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Table_table_shortName_key" ON "Table_table"("shortName");
