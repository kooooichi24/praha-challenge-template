-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ENROLLMENT', 'RECESS', 'LEFT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "Status" NOT NULL DEFAULT E'ENROLLMENT';
