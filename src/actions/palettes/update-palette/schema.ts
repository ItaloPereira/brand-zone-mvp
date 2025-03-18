import { z } from "zod";

export const updatePaletteSchema = z.object({
  id: z.string().min(1, { message: "Palette ID is required" }),
  name: z.string().trim().min(1, { message: "Name is required" }),
  colors: z.array(z.string()).min(1, { message: "At least one color is required" }),
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