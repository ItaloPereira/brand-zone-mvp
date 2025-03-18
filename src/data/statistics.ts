import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/prisma";

export type GroupStatistic = {
  id: string;
  name: string;
  imagesCount: number;
  palettesCount: number;
  totalCount: number;
};

export type TagStatistic = {
  id: string;
  name: string;
  imagesCount: number;
  palettesCount: number;
  totalCount: number;
};

export type StatisticsSummary = {
  totalImages: number;
  totalPalettes: number;
  totalGroups: number;
  totalTags: number;
};

export const getGroupStatistics = async (): Promise<GroupStatistic[]> => {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect('/login');
    }

    const groups = await db.group.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    const groupStats = await Promise.all(
      groups.map(async (group) => {
        const imagesCount = await db.images.count({
          where: {
            userId,
            groupId: group.id,
          },
        });

        const palettesCount = await db.colorPalettes.count({
          where: {
            userId,
            groupId: group.id,
          },
        });

        return {
          id: group.id,
          name: group.name,
          imagesCount,
          palettesCount,
          totalCount: imagesCount + palettesCount,
        };
      })
    );

    return groupStats.sort((a, b) => b.totalCount - a.totalCount);
  } catch (error) {
    console.error('Error fetching group statistics:', error);
    throw new Error('Could not load group statistics. Please try again later.');
  }
};

export const getTagStatistics = async (): Promise<TagStatistic[]> => {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect('/login');
    }

    const tags = await db.tag.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    const tagStats = await Promise.all(
      tags.map(async (tag) => {
        const imagesCount = await db.tagsOnImages.count({
          where: {
            tagId: tag.id,
            image: {
              userId,
            },
          },
        });

        const palettesCount = await db.tagsOnPalettes.count({
          where: {
            tagId: tag.id,
            palette: {
              userId,
            },
          },
        });

        return {
          id: tag.id,
          name: tag.name,
          imagesCount,
          palettesCount,
          totalCount: imagesCount + palettesCount,
        };
      })
    );

    return tagStats.sort((a, b) => b.totalCount - a.totalCount);
  } catch (error) {
    console.error('Error fetching tag statistics:', error);
    throw new Error('Could not load tag statistics. Please try again later.');
  }
};

export const getStatisticsSummary = async (): Promise<StatisticsSummary> => {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect('/login');
    }

    const totalImages = await db.images.count({
      where: {
        userId,
      },
    });

    const totalPalettes = await db.colorPalettes.count({
      where: {
        userId,
      },
    });

    const totalGroups = await db.group.count({
      where: {
        userId,
      },
    });

    const totalTags = await db.tag.count({
      where: {
        userId,
      },
    });

    return {
      totalImages,
      totalPalettes,
      totalGroups,
      totalTags,
    };
  } catch (error) {
    console.error('Error fetching statistics summary:', error);
    throw new Error('Could not load statistics summary. Please try again later.');
  }
}; 