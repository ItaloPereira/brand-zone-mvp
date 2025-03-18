"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Group, Tag } from "@prisma/client";
import { Loader2 } from "lucide-react";
import NextImage from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createImage } from "@/actions/create-image";
import { GroupSelector, type GroupValue } from "@/components/fields/GroupSelector";
import { TagSelector, type TagValue } from "@/components/fields/TagSelector";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useShared } from "@/contexts/SharedContext";

const formSchema = z.object({
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

type FormSchema = z.infer<typeof formSchema>;

interface AddImageFromUrlFormProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

const AddImageFromUrlForm = ({ dialogOpen, setDialogOpen }: AddImageFromUrlFormProps) => {
  const { availableGroups, availableTags } = useShared();

  const [clientGroups, setClientGroups] = useState<Group[]>(availableGroups);
  const [clientTags, setClientTags] = useState<Tag[]>(availableTags);
  const [imagePreview, setImagePreview] = useState<{
    url: string;
    status: "loading" | "error" | "success";
  } | null>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      name: "",
      group: undefined,
      tags: [],
      comments: "",
    },
    mode: "onChange",
  });

  const handleUrlChange = (url: string) => {
    if (!url) {
      setImagePreview(null);
      return;
    }

    try {
      new URL(url);
      setImagePreview({ url, status: "loading" });

      const img = new Image();
      img.onload = () => {
        setImagePreview({ url, status: "success" });
        form.clearErrors("url");

        const currentName = form.getValues("name");
        if (!currentName) {
          try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const filename = pathname.split('/').pop() || '';
            const nameWithoutExt = filename.split('.')[0].replace(/[-_]/g, ' ');
            const suggestedName = nameWithoutExt
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

            if (suggestedName) {
              form.setValue("name", suggestedName);
            }
          } catch {
            // If URL parsing fails, don't set a name
          }
        }
      };
      img.onerror = () => {
        setImagePreview({ url, status: "error" });
        form.setError("url", {
          type: "manual",
          message: "Could not load image from this URL"
        });
      };
      img.src = url;
    } catch {
      setImagePreview(null);
      form.setError("url", {
        type: "manual",
        message: "Please enter a valid URL"
      });
    }
  };

  const resetForm = useCallback(() => {
    form.reset();
    setImagePreview(null);
    setClientGroups(availableGroups);
    setClientTags(availableTags);
  }, [form, availableGroups, availableTags])

  const onSubmit = async (data: FormSchema) => {
    try {
      if (imagePreview?.status === "error") {
        form.setError("url", {
          type: "manual",
          message: "Please provide a valid image URL"
        });
        return;
      }

      if (data.url && imagePreview?.status === "loading") {
        form.setError("url", {
          type: "manual",
          message: "Please wait for the image to load"
        });
        return;
      }

      if (!imagePreview || imagePreview.status !== "success") {
        form.setError("url", {
          type: "manual",
          message: "Please provide a valid image URL"
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
  }, [dialogOpen, resetForm])


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4 pb-2">
        {form.formState.errors.root && (
          <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
            {form.formState.errors.root.message}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.clearErrors("url");
                        handleUrlChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image name</FormLabel>
                  <FormControl>
                    <Input placeholder="My image" {...field} />
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="text-sm font-medium">Preview</div>
              <div className="relative aspect-video w-full rounded-lg border border-border overflow-hidden bg-muted max-h-[30vh] sm:max-h-[40vh]">
                {!imagePreview && (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    Enter an image URL
                  </div>
                )}
                {imagePreview?.status === "loading" && (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    Loading...
                  </div>
                )}
                {imagePreview?.status === "error" && (
                  <div className="absolute inset-0 flex items-center justify-center text-destructive">
                    Failed to load image
                  </div>
                )}
                {imagePreview?.status === "success" && (
                  <div className="relative w-full h-full">
                    <NextImage
                      src={imagePreview.url}
                      alt="Preview"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

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
                <Textarea placeholder="Comments" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            Save
            {form.formState.isSubmitting && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default AddImageFromUrlForm;