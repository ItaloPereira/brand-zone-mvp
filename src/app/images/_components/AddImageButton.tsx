"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Group, Tag } from "@prisma/client";
import { Check, ChevronsUpDown, Link2, Loader2, PlusIcon, Sparkles, Upload } from "lucide-react";
import NextImage from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createImage } from "@/actions/create-image";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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

interface AddImageButtonProps {
  availableGroups: Group[];
  availableTags: Tag[];
}

const AddImageButton = ({ availableGroups, availableTags }: AddImageButtonProps) => {
  const [clientGroups, setClientGroups] = useState<Group[]>(availableGroups);
  const [clientTags, setClientTags] = useState<Tag[]>(availableTags);
  const [groupInputValue, setGroupInputValue] = useState("");
  const [tagInputValue, setTagInputValue] = useState("");
  const [imagePreview, setImagePreview] = useState<{
    url: string;
    status: "loading" | "error" | "success";
  } | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setClientGroups(availableGroups);
    setClientTags(availableTags);
  }, [availableGroups, availableTags]);

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

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      form.reset();
      setImagePreview(null);
      setClientGroups(availableGroups);
      setClientTags(availableTags);
    }
  };

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
        console.log({ data });

        await createImage(data);

        form.reset();
        setImagePreview(null);
        setClientGroups(availableGroups);
        setClientTags(availableTags);
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

  const handleAddNewGroup = useCallback((name: string) => {
    const tempId = `temp_${Date.now()}`;
    const newGroup = {
      id: tempId,
      name,
      userId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setClientGroups(prev => [...prev, newGroup]);
    return newGroup;
  }, []);

  const handleAddNewTag = useCallback((name: string) => {
    const tempId = `temp_${Date.now()}`;
    const newTag = {
      id: tempId,
      name,
      userId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setClientTags(prev => [...prev, newTag]);
    return newTag;
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          <PlusIcon />
          Add image
        </Button>
      </PopoverTrigger>

      <PopoverContent className="bg-muted px-0" align="end">
        <div className="flex flex-col">
          <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="hover:bg-neutral-700 justify-start rounded-none has-[>svg]:px-5 font-normal"
              >
                <Link2 />
                URL
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl sm:!max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload image from URL</DialogTitle>
              </DialogHeader>

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
                                  // Clear previous errors when the user types
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
                            <FormLabel>Group (optional)</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      "w-full justify-between",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value
                                      ? field.value.name
                                      : "Select group"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="p-0" style={{ width: 'var(--radix-popper-anchor-width)' }} align="start">
                                <Command className="w-full">
                                  <CommandInput
                                    placeholder="Search group..."
                                    onValueChange={setGroupInputValue}
                                    value={groupInputValue}
                                  />
                                  <CommandList>
                                    <CommandEmpty className="py-0">
                                      <Button
                                        variant="ghost"
                                        className="justify-start w-full px-2"
                                        onClick={() => {
                                          const value = groupInputValue.trim();
                                          if (value) {
                                            const newGroup = handleAddNewGroup(value);
                                            field.onChange({
                                              id: newGroup.id,
                                              name: value,
                                              isNew: true,
                                            });
                                            setGroupInputValue("");
                                          }
                                        }}
                                      >
                                        Add &quot;{groupInputValue.trim()}&quot;
                                      </Button>
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {clientGroups.map((group) => (
                                        <CommandItem
                                          value={group.name}
                                          key={group.id}
                                          onSelect={() => {
                                            field.onChange({
                                              id: group.id,
                                              name: group.name,
                                              isNew: group.id.startsWith('temp_'),
                                            });
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              field.value?.id === group.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {group.name}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
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
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value?.length && "text-muted-foreground"
                                )}
                              >
                                {field.value?.length
                                  ? `${field.value.length} tag${field.value.length === 1 ? "" : "s"} selected`
                                  : "Select tags"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0" style={{ width: 'var(--radix-popper-anchor-width)' }} align="start">
                            <Command className="w-full">
                              <CommandInput
                                placeholder="Search tags..."
                                onValueChange={setTagInputValue}
                                value={tagInputValue}
                              />
                              <CommandList>
                                <CommandEmpty className="py-0">
                                  <Button
                                    variant="ghost"
                                    className="justify-start w-full px-2 py-1.5"
                                    onClick={() => {
                                      const value = tagInputValue.trim();
                                      if (value) {
                                        const newTag = handleAddNewTag(value);
                                        field.onChange([
                                          ...field.value,
                                          {
                                            id: newTag.id,
                                            name: value,
                                            isNew: true,
                                          }
                                        ]);
                                        setTagInputValue("");
                                      }
                                    }}
                                  >
                                    Add &quot;{tagInputValue.trim()}&quot;
                                  </Button>
                                </CommandEmpty>
                                <CommandGroup>
                                  {clientTags.map((tag) => (
                                    <CommandItem
                                      value={tag.name}
                                      key={tag.id}
                                      onSelect={() => {
                                        const isSelected = field.value.some(t => t.id === tag.id);
                                        if (isSelected) {
                                          field.onChange(field.value.filter(t => t.id !== tag.id));
                                        } else {
                                          field.onChange([
                                            ...field.value,
                                            {
                                              id: tag.id,
                                              name: tag.name,
                                              isNew: tag.id.startsWith('temp_'),
                                            }
                                          ]);
                                        }
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value.some(t => t.id === tag.id)
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {tag.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
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
                        form.reset();
                        setImagePreview(null);
                        setClientGroups(availableGroups);
                        setClientTags(availableTags);
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
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            className="hover:bg-neutral-700 justify-start rounded-none has-[>svg]:px-5 font-normal"
          >
            <Upload />
            Upload
          </Button>
          <Button
            variant="ghost"
            className="hover:bg-neutral-700 justify-start rounded-none has-[>svg]:px-5 font-normal group"
          >
            <Sparkles className="text-purple-500" />
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Generate
            </span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddImageButton;
