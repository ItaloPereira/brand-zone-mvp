"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/prisma";

import { updatePaletteSchema } from "./schema";

export const updatePalette = async (formData: unknown) => {
  const validatedData = updatePaletteSchema.parse(formData);

  const { userId } = await auth();

  if (!userId) {
    redirect('/login');
  }

  const existingPalette = await db.colorPalettes.findUnique({
    where: {
      id: validatedData.id,
      userId,
    },
  });

  if (!existingPalette) {
    throw new Error("Palette not found or you don't have permission to edit it");
  }

  return await db.$transaction(async (tx) => {
    let groupId: string | null = null;

    if (validatedData.group) {
      if (validatedData.group.isNew) {
        const newGroup = await tx.group.create({
          data: {
            name: validatedData.group.name,
            userId,
          },
        });
        groupId = newGroup.id;
      } else if (validatedData.group.id) {
        const existingGroup = await tx.group.findUnique({
          where: {
            id: validatedData.group.id,
            userId,
          },
        });

        if (!existingGroup) {
          throw new Error("Group not found or does not belong to the user");
        }

        groupId = existingGroup.id;
      }
    }

    const updatedPalette = await tx.colorPalettes.update({
      where: {
        id: validatedData.id,
      },
      data: {
        name: validatedData.name,
        colors: validatedData.colors,
        comments: validatedData.comments,
        groupId: groupId,
      },
    });

    await tx.tagsOnPalettes.deleteMany({
      where: {
        paletteId: validatedData.id,
      },
    });

    if (validatedData.tags.length > 0) {
      await Promise.all(
        validatedData.tags.map(async (tagData) => {
          let tagId: string;

          if (tagData.isNew) {
            const newTag = await tx.tag.create({
              data: {
                name: tagData.name,
                userId,
              },
            });
            tagId = newTag.id;
          } else if (tagData.id) {
            const existingTag = await tx.tag.findUnique({
              where: {
                id: tagData.id,
                userId,
              },
            });

            if (!existingTag) {
              throw new Error("Tag not found or does not belong to the user");
            }

            tagId = existingTag.id;
          } else {
            throw new Error("Invalid tag data");
          }

          return tx.tagsOnPalettes.create({
            data: {
              paletteId: updatedPalette.id,
              tagId,
            },
          });
        })
      );
    }

    revalidatePath("/palettes");

    return updatedPalette;
  });
}; 