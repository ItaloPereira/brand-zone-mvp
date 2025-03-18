import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { GetImagesProps } from "@/app/images/_utils/filters";
import { db } from "@/lib/prisma";

export const getImages = async ({ groupId, tagIds, keyword }: GetImagesProps) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect('/login');
    }

    const images = await db.images.findMany({
      where: {
        userId: userId,
        ...(groupId && { groupId: groupId }),
        ...(tagIds && { tags: { some: { tagId: { in: tagIds } } } }),
        ...(keyword && {
          OR: [
            { name: { contains: keyword, mode: 'insensitive' } },
            { comments: { contains: keyword, mode: 'insensitive' } }
          ]
        }),
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        group: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return images;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw new Error('It was not possible to load your images. Try again later.');
  }
};