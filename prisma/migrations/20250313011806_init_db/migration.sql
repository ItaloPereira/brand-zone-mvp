-- CreateTable
CREATE TABLE "Images" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "src" VARCHAR(1024) NOT NULL,
    "comments" VARCHAR(2000),
    "groupId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ColorPalettes" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "colors" VARCHAR(255)[],
    "comments" VARCHAR(2000),
    "groupId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ColorPalettes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagsOnImages" (
    "id" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TagsOnImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagsOnPalettes" (
    "id" TEXT NOT NULL,
    "paletteId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TagsOnPalettes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "TagsOnImages_imageId_idx" ON "TagsOnImages"("imageId");

-- CreateIndex
CREATE INDEX "TagsOnImages_tagId_idx" ON "TagsOnImages"("tagId");

-- CreateIndex
CREATE INDEX "TagsOnPalettes_paletteId_idx" ON "TagsOnPalettes"("paletteId");

-- CreateIndex
CREATE INDEX "TagsOnPalettes_tagId_idx" ON "TagsOnPalettes"("tagId");

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColorPalettes" ADD CONSTRAINT "ColorPalettes_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnImages" ADD CONSTRAINT "TagsOnImages_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnImages" ADD CONSTRAINT "TagsOnImages_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnPalettes" ADD CONSTRAINT "TagsOnPalettes_paletteId_fkey" FOREIGN KEY ("paletteId") REFERENCES "ColorPalettes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnPalettes" ADD CONSTRAINT "TagsOnPalettes_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
