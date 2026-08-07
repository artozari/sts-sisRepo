-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Casino_table" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "casinoCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "mqtt_url" TEXT NOT NULL,
    "mqtt_port" TEXT NOT NULL,
    "mqtt_protocol" TEXT NOT NULL,
    "mqtt_tls" BOOLEAN NOT NULL,
    "mqtt_user" TEXT NOT NULL,
    "mqtt_password" TEXT NOT NULL,
    "mqtt_refresh_time_msec" INTEGER NOT NULL
);
INSERT INTO "new_Casino_table" ("address", "casinoCode", "city", "country", "createdAt", "id", "latitude", "longitude", "mqtt_password", "mqtt_port", "mqtt_protocol", "mqtt_refresh_time_msec", "mqtt_tls", "mqtt_url", "mqtt_user", "name", "province", "updatedAt") SELECT "address", "casinoCode", "city", "country", "createdAt", "id", "latitude", "longitude", "mqtt_password", "mqtt_port", "mqtt_protocol", "mqtt_refresh_time_msec", "mqtt_tls", "mqtt_url", "mqtt_user", "name", "province", "updatedAt" FROM "Casino_table";
DROP TABLE "Casino_table";
ALTER TABLE "new_Casino_table" RENAME TO "Casino_table";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
