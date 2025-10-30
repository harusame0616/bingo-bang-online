/*
  Warnings:

  - The primary key for the `LOTTERY_NUMBER` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "LOTTERY_NUMBER" DROP CONSTRAINT "LOTTERY_NUMBER_pkey",
ADD CONSTRAINT "LOTTERY_NUMBER_pkey" PRIMARY KEY ("view_id", "lottery_number");
