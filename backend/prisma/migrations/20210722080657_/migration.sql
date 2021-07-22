-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('TODO', 'REVIEWING', 'DONE');

-- CreateTable
CREATE TABLE "Tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTaskStatus" (
    "status" "ProgressStatus" NOT NULL DEFAULT E'TODO',
    "UserId" TEXT NOT NULL,
    "TaskId" TEXT NOT NULL,

    PRIMARY KEY ("UserId","TaskId")
);

-- AddForeignKey
ALTER TABLE "UserTaskStatus" ADD FOREIGN KEY ("UserId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTaskStatus" ADD FOREIGN KEY ("TaskId") REFERENCES "Tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
