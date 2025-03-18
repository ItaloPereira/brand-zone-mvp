import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { GetPalettesProps } from "@/app/palettes/_utils/filters";
import { db } from "@/lib/prisma";

export const getPalettes = async ({ groupId, tagIds, keyword }: GetPalettesProps) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect('/login');
    }

    const palettes = await db.colorPalettes.findMany({
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

    return palettes;
  } catch (error) {
    console.error('Error fetching palettes:', error);
    throw new Error('It was not possible to load your palettes. Try again later.');
  }
};