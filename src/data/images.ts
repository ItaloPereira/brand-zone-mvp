import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { ImageGroupView, ImageView } from "@/app/images/constants";
import { db } from "@/lib/prisma";

interface ImageSearchParams {
  groupId?: string;
  tagIds?: string[];
  keyword?: string;
}

interface ImageViewParams {
  view: ImageView;
  groupView: ImageGroupView;
}

class ImageSearchParamsManager {
  private searchParams: URLSearchParams;

  constructor(searchParams: URLSearchParams) {
    this.searchParams = searchParams;
  }

  getSearchParams(): ImageSearchParams {
    const groupId = this.searchParams.get("groupId") || undefined;
    const tagIdsParam = this.searchParams.get("tagIds");
    const keyword = this.searchParams.get("keyword") || undefined;

    return {
      groupId,
      tagIds: tagIdsParam?.split(",").filter(Boolean),
      keyword,
    };
  }

  getViewParams(): ImageViewParams {
    const viewParam = this.searchParams.get("view");
    const groupViewParam = this.searchParams.get("groupView");

    const isValidView = Object.values(ImageView).includes(viewParam as ImageView);
    const isValidGroupView = Object.values(ImageGroupView).includes(groupViewParam as ImageGroupView);

    return {
      view: isValidView ? viewParam as ImageView : ImageView.GRID,
      groupView: isValidGroupView ? groupViewParam as ImageGroupView : ImageGroupView.SINGLE,
    };
  }

  static createSearchParams(params: Partial<ImageSearchParams & ImageViewParams>): URLSearchParams {
    const searchParams = new URLSearchParams();

    if (params.groupId) {
      searchParams.set("groupId", params.groupId);
    }

    if (params.tagIds?.length) {
      searchParams.set("tagIds", params.tagIds.join(","));
    }

    if (params.keyword) {
      searchParams.set("keyword", params.keyword.trim());
    }

    if (params.view) {
      searchParams.set("view", params.view);
    }

    if (params.groupView) {
      searchParams.set("groupView", params.groupView);
    }

    return searchParams;
  }
}

interface GetImagesProps {
  groupId?: string;
  tagIds?: string[];
  keyword?: string;
}

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
        ...(keyword && { name: { contains: keyword, mode: 'insensitive' } }),
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

export const getImageViewParams = (searchParams: URLSearchParams): ImageViewParams => {
  return new ImageSearchParamsManager(searchParams).getViewParams();
};

export { ImageSearchParamsManager };
