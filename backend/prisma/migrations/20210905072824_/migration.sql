-- CreateTable
CREATE TABLE "Pairs" (
    "id" TEXT NOT NULL,
    "name" CHAR(1) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBelongingPair" (
    "userId" TEXT NOT NULL,
    "pairId" TEXT NOT NULL,

    PRIMARY KEY ("userId","pairId")
);

-- AddForeignKey
ALTER TABLE "UserBelongingPair" ADD FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBelongingPair" ADD FOREIGN KEY ("pairId") REFERENCES "Pairs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
