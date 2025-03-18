"use server";

import OpenAI from "openai";

import { generateImageSchema } from "./schema";

export async function generateImageOpenAI(data: { prompt: string }) {
  try {
    const validatedData = generateImageSchema.parse({
      prompt: data.prompt,
    });

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log("Generating image with OpenAI:", validatedData);

    const response = await openai.images.generate({
      model: validatedData.model,
      prompt: validatedData.prompt + (validatedData.negativePrompt ? `. Avoid: ${validatedData.negativePrompt}` : ""),
      n: validatedData.n,
      size: validatedData.size,
      quality: validatedData.quality,
      style: validatedData.style,
    });

    console.log("OpenAI Response:", response);

    if (response.data && response.data.length > 0) {
      return {
        success: true,
        imageUrl: response.data[0].url,
        revisedPrompt: response.data[0].revised_prompt
      };
    }

    return { success: false, error: "Failed to generate image" };
  } catch (error) {
    console.error("Error generating image with OpenAI:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
} 