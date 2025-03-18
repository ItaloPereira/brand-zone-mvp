"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/prisma";

export const deleteImage = async (imageId: string) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect('/login');
    }

    const image = await db.images.findUnique({
      where: {
        id: imageId,
        userId,
      },
    });

    if (!image) {
      throw new Error("Image not found or does not belong to the user");
    }

    await db.tagsOnImages.deleteMany({
      where: {
        imageId,
      },
    });

    await db.images.delete({
      where: {
        id: imageId,
      },
    });

    revalidatePath("/images");

    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete image"
    };
  }
}; 