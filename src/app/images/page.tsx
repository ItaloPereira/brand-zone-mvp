import { auth } from "@clerk/nextjs/server";
import { Download, EllipsisVertical, Eye, MessageCircleMore, Pencil, PlusIcon, Trash } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { db } from "@/lib/prisma";

const ImagesPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const images = await db.images.findMany({
    where: {
      userId: userId,
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
      group: true,
    },
  });

  console.log("Dados do banco:", images);

  return (
    <main>
      <section className="px-8 py-6 flex justify-between items-center w-full">
        <h1 className="text-3xl font-bold">Images</h1>
        <Button>
          <PlusIcon />
          Add image
        </Button>
      </section>

      <section className="px-8 py-6">
        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                role="button"
                className="aspect-[4/3] px-3 pb-3 bg-muted rounded-md hover:bg-emerald-950 cursor-pointer"
              >
                <div className="flex justify-between items-center py-2">
                  <h2 className="text-md line-clamp-1 font-medium">{image.name}</h2>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="hover:bg-neutral-700"
                        size="icon"
                        title="More options"
                        aria-label="More options"
                      >
                        <EllipsisVertical />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-muted px-0" align="start">
                      <div className="flex flex-col">
                        <Button
                          variant="ghost"
                          className="hover:bg-neutral-700 justify-start rounded-none has-[>svg]:px-5 font-normal"
                        >
                          <Eye />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          className="hover:bg-neutral-700 justify-start rounded-none has-[>svg]:px-5 font-normal"
                        >
                          <Download />
                          Download
                        </Button>
                        <Button
                          variant="ghost"
                          className="hover:bg-neutral-700 justify-start rounded-none has-[>svg]:px-5 font-normal"
                        >
                          <Pencil />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          className="hover:bg-neutral-700 justify-start rounded-none has-[>svg]:px-5 font-normal"
                        >
                          <Trash />
                          Delete
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                </div>
                <div className="relative h-full rounded-xs overflow-hidden">
                  <Image src={image.src} alt={image.name} fill className="object-cover" />
                  {(image.group || image.comments) && (
                    <div className="absolute top-2 right-2 bottom-2 flex flex-col gap-2 items-end justify-between">
                      {image.group && (
                        <Badge
                          className="max-w-32 truncate block"
                          title={image.group.name}
                        >
                          {image.group.name}
                        </Badge>
                      )}
                      {image.comments && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              size="icon"
                              title="More options"
                              aria-label="More options"
                              className="mt-auto"
                            >
                              <MessageCircleMore />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="bg-muted w-90:" align="start" side="bottom">
                            <div className="flex flex-col">
                              <p>{image.comments}</p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center">No results found. Add your first image to get started.</p>
        )}
      </section>

    </main>
  );
};

export default ImagesPage;
