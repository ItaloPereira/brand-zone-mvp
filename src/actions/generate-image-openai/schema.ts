import { z } from "zod";

export const generateImageSchema = z.object({
  prompt: z.string().min(1).max(1000),
  negativePrompt: z.string().optional(),
  model: z.string().optional().default("dall-e-3"),
  size: z.enum(["1024x1024", "1792x1024", "1024x1792"]).optional().default("1024x1024"),
  quality: z.enum(["standard", "hd"]).optional().default("standard"),
  style: z.enum(["vivid", "natural"]).optional().default("vivid"),
  n: z.number().optional().default(1),
});

export type GenerateImageInput = z.infer<typeof generateImageSchema>; 