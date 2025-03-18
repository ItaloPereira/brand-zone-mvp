"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/prisma";

import { createImageSchema } from "./schema";

export const createImage = async (formData: unknown) => {
  const validatedData = createImageSchema.parse(formData);

  const { userId } = await auth();

  if (!userId) {
    redirect('/login');
  }

  return await db.$transaction(async (tx) => {
    let groupId: string | undefined = undefined;

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

    const image = await tx.images.create({
      data: {
        name: validatedData.name,
        src: validatedData.url,
        comments: validatedData.comments,
        userId,
        ...(groupId && { groupId }),
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

          return tx.tagsOnImages.create({
            data: {
              imageId: image.id,
              tagId,
            },
          });
        })
      );
    }

    revalidatePath("/images");

    return image;
  });
};