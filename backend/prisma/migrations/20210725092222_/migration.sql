/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[title]` on the table `Tasks`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tasks.title_unique" ON "Tasks"("title");
