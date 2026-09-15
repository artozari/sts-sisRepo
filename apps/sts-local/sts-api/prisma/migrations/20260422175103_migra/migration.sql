/*
  Warnings:

  - A unique constraint covering the columns `[time]` on the table `Cutoff_table` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cutoff_table_time_key" ON "Cutoff_table"("time");
