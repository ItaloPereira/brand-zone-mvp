import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/prisma";

export const getGroups = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect('/login');
    }

    const groups = await db.group.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return groups;
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw new Error('It was not possible to load your groups. Try again later.');
  }
};

export const getTags = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect('/login');
    }

    const tags = await db.tag.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return tags;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw new Error('It was not possible to load your tags. Try again later.');
  }
};
