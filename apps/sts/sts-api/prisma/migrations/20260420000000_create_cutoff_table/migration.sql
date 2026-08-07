-- CreateTable "Cutoff_table"
CREATE TABLE "Cutoff_table" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "time" DATETIME NOT NULL,
    "key" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enable" BOOLEAN NOT NULL DEFAULT 0,
    "tick" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "liberado" TEXT,
    "hash" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0
);