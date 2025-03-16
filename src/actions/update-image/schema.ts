import { z } from "zod";

const groupSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Group name is required" }),
  isNew: z.boolean(),
}).optional();

const tagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Tag name is required" }),
  isNew: z.boolean(),
});

export const updateImageSchema = z.object({
  id: z.string().min(1, { message: "Image ID is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  group: groupSchema,
  tags: z.array(tagSchema),
  comments: z.string().optional(),
}); 