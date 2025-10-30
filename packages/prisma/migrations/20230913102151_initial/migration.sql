-- CreateTable
CREATE TABLE "BINGO_CARD" (
    "id" CHAR(36) NOT NULL,
    "squares" INTEGER[],
    "name" VARCHAR(40) NOT NULL,
    "bingo_game_id" CHAR(36) NOT NULL,

    CONSTRAINT "BINGO_CARD_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BINGO_GAME" (
    "id" CHAR(36) NOT NULL,
    "lottery_numbers" INTEGER[],
    "view_id" CHAR(36) NOT NULL,

    CONSTRAINT "BINGO_GAME_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BINGO_GAME_view_id_key" ON "BINGO_GAME"("view_id");
