"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/prisma";

export const deletePalette = async (paletteId: string) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect('/login');
    }

    const palette = await db.colorPalettes.findUnique({
      where: {
        id: paletteId,
        userId,
      },
    });

    if (!palette) {
      throw new Error("Palette not found or does not belong to the user");
    }

    await db.tagsOnPalettes.deleteMany({
      where: {
        paletteId,
      },
    });

    await db.colorPalettes.delete({
      where: {
        id: paletteId,
      },
    });

    revalidatePath("/palettes");

    return { success: true };
  } catch (error) {
    console.error("Error deleting palette:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete palette"
    };
  }
}; 