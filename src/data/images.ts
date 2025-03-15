import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/prisma";

export const getImages = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect('/login');
    }

    const images = await db.images.findMany({
      where: {
        userId: userId,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        group: true,
      },
    });

    return images;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw new Error('It was not possible to load your images. Try again later.');
  }
};
