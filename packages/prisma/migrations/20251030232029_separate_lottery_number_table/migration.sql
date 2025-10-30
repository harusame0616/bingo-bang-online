/*
  Warnings:

  - You are about to drop the column `lottery_numbers` on the `BINGO_GAME` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BINGO_GAME" DROP COLUMN "lottery_numbers";

-- CreateTable
CREATE TABLE "LOTTERY_NUMBER" (
    "view_id" CHAR(36) NOT NULL,
    "lottery_number" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "LOTTERY_NUMBER_pkey" PRIMARY KEY ("view_id","lottery_number","order")
);

-- AddForeignKey
ALTER TABLE "LOTTERY_NUMBER" ADD CONSTRAINT "LOTTERY_NUMBER_view_id_fkey" FOREIGN KEY ("view_id") REFERENCES "BINGO_GAME"("view_id") ON DELETE RESTRICT ON UPDATE CASCADE;
