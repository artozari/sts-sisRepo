-- CreateTable
CREATE TABLE "Casino_table" (
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
    "mqtt_port" INTEGER NOT NULL,
    "mqtt_protocol" TEXT NOT NULL,
    "mqtt_tls" BOOLEAN NOT NULL,
    "mqtt_user" TEXT NOT NULL,
    "mqtt_password" TEXT NOT NULL,
    "mqtt_refresh_time_msec" INTEGER NOT NULL
);
