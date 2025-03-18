"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/prisma";

import { updateImageSchema } from "./schema";

export const updateImage = async (formData: unknown) => {
  const validatedData = updateImageSchema.parse(formData);

  const { userId } = await auth();

  if (!userId) {
    redirect('/login');
  }

  return await db.$transaction(async (tx) => {
    const existingImage = await tx.images.findUnique({
      where: {
        id: validatedData.id,
        userId,
      },
    });

    if (!existingImage) {
      throw new Error("Image not found or does not belong to the user");
    }

    let groupId: string | undefined | null = existingImage.groupId;

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
      } else {
        groupId = null;
      }
    } else {
      groupId = null;
    }

    const updatedImage = await tx.images.update({
      where: {
        id: validatedData.id,
      },
      data: {
        name: validatedData.name,
        comments: validatedData.comments,
        groupId,
      },
    });

    await tx.tagsOnImages.deleteMany({
      where: {
        imageId: validatedData.id,
      },
    });

    if (validatedData.tags && validatedData.tags.length > 0) {
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

          return tx.tagsOnImages.create({
            data: {
              imageId: validatedData.id,
              tagId,
            },
          });
        })
      );
    }

    revalidatePath("/images");

    return { success: true, image: updatedImage };
  }).catch((error) => {
    console.error("Error updating image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update image"
    };
  });
}; 