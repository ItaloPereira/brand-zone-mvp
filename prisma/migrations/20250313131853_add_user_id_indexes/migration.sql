/*
  Warnings:

  - Added the required column `userId` to the `ColorPalettes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ColorPalettes" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Images" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "ColorPalettes_userId_idx" ON "ColorPalettes"("userId");

-- CreateIndex
CREATE INDEX "Group_userId_idx" ON "Group"("userId");

-- CreateIndex
CREATE INDEX "Images_userId_idx" ON "Images"("userId");

-- CreateIndex
CREATE INDEX "Tag_userId_idx" ON "Tag"("userId");
