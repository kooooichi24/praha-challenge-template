-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ENROLLMENT', 'RECESS', 'LEFT');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "status" "EnrollmentStatus" NOT NULL DEFAULT E'ENROLLMENT',

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users.mail_unique" ON "Users"("mail");
