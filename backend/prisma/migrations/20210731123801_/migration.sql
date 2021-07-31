/*
  Warnings:

  - The migration will change the primary key for the `UserTaskStatus` table. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UserId` on the `UserTaskStatus` table. All the data in the column will be lost.
  - You are about to drop the column `TaskId` on the `UserTaskStatus` table. All the data in the column will be lost.
  - Added the required column `userId` to the `UserTaskStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskId` to the `UserTaskStatus` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserTaskStatus" DROP CONSTRAINT "UserTaskStatus_TaskId_fkey";

-- DropForeignKey
ALTER TABLE "UserTaskStatus" DROP CONSTRAINT "UserTaskStatus_UserId_fkey";

-- AlterTable
ALTER TABLE "UserTaskStatus" DROP CONSTRAINT "UserTaskStatus_pkey",
DROP COLUMN "UserId",
DROP COLUMN "TaskId",
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "taskId" TEXT NOT NULL,
ADD PRIMARY KEY ("userId", "taskId");

-- AddForeignKey
ALTER TABLE "UserTaskStatus" ADD FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTaskStatus" ADD FOREIGN KEY ("taskId") REFERENCES "Tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
