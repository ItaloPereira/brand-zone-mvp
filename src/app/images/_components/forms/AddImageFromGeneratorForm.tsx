"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Group, Tag } from "@prisma/client";
import { Loader2, Sparkles } from "lucide-react";
import NextImage from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createImage } from "@/actions/create-image";
import { generateImageOpenAI } from "@/actions/generate-image-openai";
import { GroupSelector, type GroupValue } from "@/components/fields/GroupSelector";
import { TagSelector, type TagValue } from "@/components/fields/TagSelector";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useShared } from "@/contexts/SharedContext";

const promptSchema = z.object({
  prompt: z.string().trim().min(1, { message: "Prompt is required" }).max(1000, { message: "Prompt is too long" }),
});

const formSchema = z.object({
  prompt: z.string().trim().min(1, { message: "Prompt is required" }).max(1000, { message: "Prompt is too long" }),
  url: z.string().trim().min(1, { message: "Image URL is required" }),
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
  revisedPrompt: z.string().optional(),
});

type PromptSchema = z.infer<typeof promptSchema>;
type FormSchema = z.infer<typeof formSchema>;

interface AddImageFromGeneratorFormProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

const AddImageFromGeneratorForm = ({ dialogOpen, setDialogOpen }: AddImageFromGeneratorFormProps) => {
  const { availableGroups, availableTags } = useShared();

  const [clientGroups, setClientGroups] = useState<Group[]>(availableGroups);
  const [clientTags, setClientTags] = useState<Tag[]>(availableTags);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [revisedPrompt, setRevisedPrompt] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Step 1: Prompt form
  const promptForm = useForm<PromptSchema>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      prompt: "",
    },
  });

  // Step 2: Complete form (includes prompt and additional fields)
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      url: "",
      name: "",
      group: undefined,
      tags: [],
      comments: "",
      revisedPrompt: "",
    },
    mode: "onChange",
  });

  const handleGenerateImage = async (values: PromptSchema) => {
    setIsGenerating(true);
    setImagePreview(null);
    setRevisedPrompt(null);

    try {
      const result = await generateImageOpenAI({
        prompt: values.prompt,
      });

      if (result.success && result.imageUrl) {
        setImagePreview(result.imageUrl);
        form.setValue("url", result.imageUrl);
        form.setValue("prompt", values.prompt);

        // Set revised prompt if available
        if (result.revisedPrompt) {
          setRevisedPrompt(result.revisedPrompt);
          form.setValue("revisedPrompt", result.revisedPrompt);
        }

        // Suggest a name based on the prompt
        const suggestedName = values.prompt
          .split(' ')
          .slice(0, 5)
          .join(' ');

        form.setValue("name", suggestedName);
      } else {
        console.error("Error:", result.error || "Failed to generate image");
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = useCallback(() => {
    promptForm.reset();
    form.reset();
    setImagePreview(null);
    setRevisedPrompt(null);
    setClientGroups(availableGroups);
    setClientTags(availableTags);
  }, [promptForm, form, availableGroups, availableTags]);

  const onSubmit = async (data: FormSchema) => {
    try {
      if (!imagePreview) {
        form.setError("url", {
          type: "manual",
          message: "Please generate a valid image first"
        });
        return;
      }

      try {
        await createImage(data);
        resetForm();
        setDialogOpen(false);
      } catch (error) {
        console.error("Error submitting form:", error);
        form.setError("root", {
          type: "manual",
          message: "Failed to save the image. Please try again."
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    if (!dialogOpen) {
      resetForm();
    }
  }, [dialogOpen, resetForm]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Step 1: Prompt Input */}
          <Form {...promptForm}>
            <form onSubmit={promptForm.handleSubmit(handleGenerateImage)} className="space-y-4">
              <div className="p-3 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-700 text-sm mb-4">
                <p className="font-medium">⚠️ Experimental Feature</p>
                <p>This image generation feature is experimental. Generated images will expire after a period of time.</p>
              </div>

              <FormField
                control={promptForm.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe the image you want to generate</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A beautiful sunset over mountains with a lake in the foreground, photorealistic, 8k, detailed"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isGenerating || promptForm.formState.isSubmitting}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Image
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Preview Section */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Preview</div>
            <div className="relative aspect-square w-full rounded-lg border border-border overflow-hidden bg-muted">
              {!imagePreview && !isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                  <p>Generate an image to see preview</p>
                </div>
              )}
              {isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span>Generating your image...</span>
                </div>
              )}
              {imagePreview && !isGenerating && (
                <div className="relative w-full h-full">
                  <NextImage
                    src={imagePreview}
                    alt="Generated Preview"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
            </div>
            {revisedPrompt && (
              <div className="text-xs text-muted-foreground mt-2">
                <p className="font-medium">Revised prompt by DALL-E:</p>
                <p>{revisedPrompt}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          {/* Step 2: Image Details */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {form.formState.errors.root && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  {form.formState.errors.root.message}
                </div>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="My generated image"
                        {...field}
                        disabled={!imagePreview || isGenerating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="group"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group</FormLabel>
                    <FormControl>
                      <GroupSelector
                        value={field.value as GroupValue}
                        onChange={field.onChange}
                        availableGroups={clientGroups}
                        setAvailableGroups={setClientGroups}
                        disabled={!imagePreview || isGenerating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <TagSelector
                        value={field.value as TagValue[]}
                        onChange={field.onChange}
                        availableTags={clientTags}
                        setAvailableTags={setClientTags}
                        disabled={!imagePreview || isGenerating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comments</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Comments"
                        {...field}
                        disabled={!imagePreview || isGenerating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={!imagePreview || isGenerating || form.formState.isSubmitting}
              >
                Save Image
                {form.formState.isSubmitting && (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            setDialogOpen(false);
            resetForm();
          }}
        >
          Cancel
        </Button>
      </DialogFooter>
    </div>
  );
};

export default AddImageFromGeneratorForm;