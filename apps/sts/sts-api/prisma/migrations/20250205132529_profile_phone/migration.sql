-- AlterTable
ALTER TABLE "Profile_table" ADD COLUMN "phone" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User_table" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "activated" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User_table" ("activated", "createdAt", "email", "enabled", "id", "password", "updatedAt") SELECT "activated", "createdAt", "email", "enabled", "id", "password", "updatedAt" FROM "User_table";
DROP TABLE "User_table";
ALTER TABLE "new_User_table" RENAME TO "User_table";
CREATE UNIQUE INDEX "User_table_email_key" ON "User_table"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
