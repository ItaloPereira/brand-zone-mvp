"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Group, Tag } from "@prisma/client";
import { Loader2, Upload } from "lucide-react";
import NextImage from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createImage } from "@/actions/images/create-image";
import { getCloudinarySignature } from "@/actions/images/get-cloudinary-signature";
import { GroupSelector, type GroupValue } from "@/components/fields/GroupSelector";
import { TagSelector, type TagValue } from "@/components/fields/TagSelector";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useShared } from "@/contexts/SharedContext";

const formSchema = z.object({
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
});

type FormSchema = z.infer<typeof formSchema>;

interface AddImageFromUploadFormProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const AddImageFromUploadForm = ({ dialogOpen, setDialogOpen }: AddImageFromUploadFormProps) => {
  const { availableGroups, availableTags } = useShared();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [clientGroups, setClientGroups] = useState<Group[]>(availableGroups);
  const [clientTags, setClientTags] = useState<Tag[]>(availableTags);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const resetForm = useCallback(() => {
    form.reset();
    setImagePreview(null);
    setUploadError(null);
    setUploadProgress(0);
    setClientGroups(availableGroups);
    setClientTags(availableTags);
  }, [form, availableGroups, availableTags]);

  const onSubmit = async (data: FormSchema) => {
    try {
      if (!imagePreview) {
        form.setError("url", {
          type: "manual",
          message: "Please upload an image first"
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await handleUpload(files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`File size exceeds the maximum limit of 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError(`Only image files are allowed. Your file is of type: ${file.type}`);
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(10);

    try {
      const signatureResult = await getCloudinarySignature();

      if (!signatureResult.success) {
        throw new Error(signatureResult.error || "Failed to get signature");
      }

      if (!signatureResult.apiKey || !signatureResult.timestamp ||
        !signatureResult.signature || !signatureResult.folder ||
        !signatureResult.cloudName) {
        throw new Error("Missing required signature data");
      }

      setUploadProgress(20);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signatureResult.apiKey);
      formData.append("timestamp", signatureResult.timestamp.toString());
      formData.append("signature", signatureResult.signature);
      formData.append("folder", signatureResult.folder);
      formData.append("tags", "brand-zone");

      setUploadProgress(30);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signatureResult.cloudName}/image/upload`;

      const xhr = new XMLHttpRequest();
      xhr.open("POST", cloudinaryUrl, true);

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 70) + 30;
          setUploadProgress(percentComplete);
        }
      });

      xhr.onload = function () {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setImagePreview(response.secure_url);
          form.setValue("url", response.secure_url);

          const suggestedName = file.name
            .replace(/\.[^/.]+$/, "")
            .replace(/[-_]/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          form.setValue("name", suggestedName);
          setUploadProgress(100);
        } else {
          let errorMessage = "Failed to upload image";
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            errorMessage = errorResponse.error?.message || errorMessage;
          } catch {
            // Ignorar erro de parsing
          }
          setUploadError(errorMessage);
        }
        setIsUploading(false);
      };

      xhr.onerror = function () {
        setUploadError("Network error occurred during upload");
        setIsUploading(false);
      };

      xhr.send(formData);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError(error instanceof Error ? error.message : "Failed to upload image. Please try again.");
      setIsUploading(false);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (!dialogOpen) {
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
            <div className="space-y-2">
              <div className="text-sm font-medium">Upload Image</div>
              <div
                className={`relative aspect-video w-full rounded-lg border ${dragActive ? 'border-primary border-dashed' : 'border-border'} overflow-hidden bg-muted`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {!imagePreview ? (
                  <div className="flex flex-col items-center justify-center h-full p-6">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center mb-4">
                      Drag and drop an image here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Maximum file size: 10MB
                    </p>
                    <Button
                      type="button"
                      onClick={handleBrowseClick}
                      className="w-full md:w-auto"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading... {uploadProgress}%
                        </>
                      ) : (
                        "Upload Image"
                      )}
                    </Button>
                    {isUploading && (
                      <div className="w-full mt-4 bg-muted-foreground/20 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                    {uploadError && (
                      <div className="text-destructive text-sm mt-2 p-2 bg-destructive/10 rounded-md max-w-full overflow-auto">
                        <p className="font-semibold">Error:</p>
                        <p>{uploadError}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <NextImage
                      src={imagePreview}
                      alt="Uploaded Preview"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview(null);
                        form.setValue("url", "");
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      Change
                    </Button>
                  </div>
                )}
              </div>
            </div>

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
            disabled={!imagePreview || isUploading || form.formState.isSubmitting}
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
};

export default AddImageFromUploadForm; 