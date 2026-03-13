/*
  Warnings:

  - You are about to drop the column `holdings` on the `User` table. All the data in the column will be lost.
  - Changed the type of `side` on the `Trade` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."TradeSide" AS ENUM ('BUY', 'SELL');

-- AlterTable
ALTER TABLE "public"."Trade" ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION,
DROP COLUMN "side",
ADD COLUMN     "side" "public"."TradeSide" NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "holdings";

-- CreateTable
CREATE TABLE "public"."Holding" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "avgPrice" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Holding_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Holding" ADD CONSTRAINT "Holding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
