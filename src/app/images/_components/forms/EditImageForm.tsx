"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Group, Tag } from "@prisma/client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updateImage } from "@/actions/update-image";
import { GroupSelector, type GroupValue } from "@/components/fields/GroupSelector";
import { TagSelector, type TagValue } from "@/components/fields/TagSelector";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useImages } from "../../_context/ImagesContext";
import type { ImageItem } from "../../types";

const formSchema = z.object({
  id: z.string(),
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

interface EditImageFormProps {
  image: ImageItem;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  onSuccess?: () => void;
}

const EditImageForm = ({ image, dialogOpen, setDialogOpen, onSuccess }: EditImageFormProps) => {
  const { availableGroups, availableTags } = useImages();

  const [clientGroups, setClientGroups] = useState<Group[]>(availableGroups);
  const [clientTags, setClientTags] = useState<Tag[]>(availableTags);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: image.id,
      name: image.name,
      group: image.group ? {
        id: image.group.id,
        name: image.group.name,
        isNew: false,
      } : undefined,
      tags: image.tags.map(tagRelation => ({
        id: tagRelation.tag.id,
        name: tagRelation.tag.name,
        isNew: false,
      })),
      comments: image.comments || "",
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      setIsSubmitting(true);

      const result = await updateImage(data);

      if (result.success) {
        toast.success("Image updated successfully");
        setDialogOpen(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error('error' in result ? result.error : "Failed to update image");
      }
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!dialogOpen) {
      form.reset();
      setClientGroups(availableGroups);
      setClientTags(availableTags);
    }
  }, [dialogOpen, form, availableGroups, availableTags]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="relative aspect-square w-full rounded-lg border border-border overflow-hidden bg-muted mb-4">
            <Image
              src={image.src}
              alt={image.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 300px"
              priority
            />
          </div>
        </div>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <Textarea
                        placeholder="Add comments about this image"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !form.formState.isDirty}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditImageForm; 