"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Group, Tag } from "@prisma/client";
import { Loader2, Plus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createPalette } from "@/actions/palettes/create-palette/index";
import { updatePalette } from "@/actions/palettes/update-palette/index";
import { GroupSelector, type GroupValue } from "@/components/fields/GroupSelector";
import { TagSelector, type TagValue } from "@/components/fields/TagSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useShared } from "@/contexts/SharedContext";

import type { PaletteItem } from "../../types";

const MAX_COLORS = 10;

const formSchema = z.object({
  id: z.string().optional(),
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

type FormSchema = z.infer<typeof formSchema>;

interface UpsertPaletteFormProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  palette?: PaletteItem; // Optional palette for edit mode
}

const UpsertPaletteForm = ({ dialogOpen, setDialogOpen, palette }: UpsertPaletteFormProps) => {
  const { availableGroups, availableTags } = useShared();

  const [clientGroups, setClientGroups] = useState<Group[]>(availableGroups);
  const [clientTags, setClientTags] = useState<Tag[]>(availableTags);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
  const [currentColor, setCurrentColor] = useState("#FFFFFF");
  const isEditMode = !!palette;

  const getDefaultValues = useCallback(() => {
    if (palette) {
      return {
        id: palette.id,
        name: palette.name,
        colors: palette.colors || [],
        group: palette.group ? {
          id: palette.group.id,
          name: palette.group.name,
          isNew: false
        } : undefined,
        tags: palette.tags.map(tagItem => ({
          id: tagItem.tag.id,
          name: tagItem.tag.name,
          isNew: false
        })),
        comments: palette.comments || "",
      };
    }

    return {
      name: "",
      colors: [],
      group: undefined,
      tags: [],
      comments: "",
    };
  }, [palette]);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
    mode: "onChange",
  });

  const colors = form.watch("colors");

  const resetForm = useCallback(() => {
    form.reset(getDefaultValues());
    setClientGroups(availableGroups);
    setClientTags(availableTags);
    setSelectedColorIndex(null);
    setCurrentColor("#FFFFFF");
  }, [form, availableGroups, availableTags, getDefaultValues]);

  const onSubmit = async (data: FormSchema) => {
    try {
      if (isEditMode && data.id) {
        // Update existing palette
        await updatePalette(data);
      } else {
        // Create new palette
        await createPalette(data);
      }
      resetForm();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      form.setError("root", {
        type: "manual",
        message: `Failed to ${isEditMode ? 'update' : 'save'} the palette. Please try again.`
      });
    }
  };

  const handleColorChange = (color: { hex: string }) => {
    setCurrentColor(color.hex);
  };

  const addColor = () => {
    if (colors.length < MAX_COLORS) {
      form.setValue("colors", [...colors, currentColor]);
      setCurrentColor("#FFFFFF");
      setColorPickerOpen(false);
    }
  };

  const removeColor = (index: number) => {
    const updatedColors = colors.filter((_, i) => i !== index);
    form.setValue("colors", updatedColors);
  };

  const editColor = (index: number) => {
    setSelectedColorIndex(index);
    setCurrentColor(colors[index]);
    setColorPickerOpen(true);
  };

  const saveEditedColor = () => {
    if (selectedColorIndex !== null) {
      const updatedColors = [...colors];
      updatedColors[selectedColorIndex] = currentColor;
      form.setValue("colors", updatedColors);
      setSelectedColorIndex(null);
      setColorPickerOpen(false);
    }
  };

  useEffect(() => {
    if (dialogOpen) {
      resetForm();
    }
  }, [dialogOpen, resetForm]);

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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Palette name</FormLabel>
                  <FormControl>
                    <Input placeholder="My color palette" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card className="overflow-hidden border">
              <CardContent className="p-0">
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Colors</div>
                    <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          disabled={colors.length >= MAX_COLORS}
                        >
                          <Plus className="h-4 w-4" />
                          Add color
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 border-none shadow-lg" align="end">
                        <div className="p-3 space-y-3">
                          <ChromePicker
                            color={currentColor}
                            onChange={handleColorChange}
                            disableAlpha
                          />
                          <div className="flex justify-between">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setColorPickerOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={selectedColorIndex !== null ? saveEditedColor : addColor}
                            >
                              {selectedColorIndex !== null ? 'Save' : 'Add'}
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {colors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-muted-foreground/30 rounded-md">
                      <Plus className="h-8 w-8 text-muted-foreground/50 mb-2" />
                      <p className="text-sm text-muted-foreground">No colors added yet. Click &quot;Add color&quot; to start.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-5 gap-3">
                        {colors.map((color, index) => (
                          <div key={index} className="relative group">
                            <div
                              className="h-14 aspect-square rounded-md cursor-pointer border shadow-sm transition-all hover:scale-105 hover:shadow-md"
                              style={{ backgroundColor: color }}
                              onClick={() => editColor(index)}
                            >
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm rounded-md">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeColor(index);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="mt-1.5 text-xs text-center font-mono opacity-70">
                              {color.toUpperCase()}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Preview of the palette */}
                      <div className="mt-5 p-3 bg-muted rounded-md">
                        <div className="text-xs text-muted-foreground mb-2">Palette preview:</div>
                        <div className="flex h-6 w-full overflow-hidden rounded-md shadow-sm">
                          {colors.map((color, index) => (
                            <div
                              key={index}
                              className="h-full flex-grow transition-all"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {form.formState.errors.colors && (
                    <p className="text-sm text-destructive">{form.formState.errors.colors.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
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
                    <Textarea placeholder="Comments" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || colors.length === 0}
          >
            {isEditMode ? 'Update' : 'Save'}
            {form.formState.isSubmitting && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UpsertPaletteForm; 