/*
  Warnings:

  - You are about to drop the column `dispensaryId` on the `Strain` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Strain" DROP CONSTRAINT "Strain_dispensaryId_fkey";

-- AlterTable
ALTER TABLE "Strain" DROP COLUMN "dispensaryId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '000-000-0000';

-- CreateTable
CREATE TABLE "DispensaryStrain" (
    "id" SERIAL NOT NULL,
    "dispensaryId" INTEGER NOT NULL,
    "strainId" INTEGER NOT NULL,

    CONSTRAINT "DispensaryStrain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DispensaryUser" (
    "id" SERIAL NOT NULL,
    "dispensaryId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "DispensaryUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "DispensaryStrain" ADD CONSTRAINT "DispensaryStrain_dispensaryId_fkey" FOREIGN KEY ("dispensaryId") REFERENCES "Dispensary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispensaryStrain" ADD CONSTRAINT "DispensaryStrain_strainId_fkey" FOREIGN KEY ("strainId") REFERENCES "Strain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispensaryUser" ADD CONSTRAINT "DispensaryUser_dispensaryId_fkey" FOREIGN KEY ("dispensaryId") REFERENCES "Dispensary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispensaryUser" ADD CONSTRAINT "DispensaryUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
