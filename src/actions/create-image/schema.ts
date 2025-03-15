import { z } from "zod";

export const createImageSchema = z.object({
  url: z.string().trim().min(1, { message: "URL is required" }).max(1024, { message: "URL is too long" }).url({ message: "Invalid URL" }),
  name: z.string().trim().min(1, { message: "Name is required" }),
  group: z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: "Group name is required" }),
    isNew: z.boolean(),
  }).optional(),
  tags: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: "Tag name is required" }),
    isNew: z.boolean(),
  })),
  comments: z.string().trim().optional(),
});