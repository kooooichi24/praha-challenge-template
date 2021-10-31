-- CreateTable
CREATE TABLE "Teams" (
    "id" TEXT NOT NULL,
    "name" CHAR(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PairBelongingTeam" (
    "pairId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    PRIMARY KEY ("pairId","teamId")
);

-- AddForeignKey
ALTER TABLE "PairBelongingTeam" ADD FOREIGN KEY ("pairId") REFERENCES "Pairs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PairBelongingTeam" ADD FOREIGN KEY ("teamId") REFERENCES "Teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
