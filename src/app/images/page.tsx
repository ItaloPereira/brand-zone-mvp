import { SharedProvider } from "@/contexts/SharedContext";
import { getImages } from "@/data/images";
import { getGroups, getTags } from "@/data/shared";

import ImagesModule from "./_components/ImagesModule";
import { getImageFilters } from "./_utils/filters";

export const dynamic = 'force-dynamic';

interface ImagesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ImagesPage = async ({ searchParams }: ImagesPageProps) => {
  const availableGroups = await getGroups();
  const availableTags = await getTags();

  const filters = getImageFilters(await searchParams, {
    availableGroups,
    availableTags,
  });

  const images = await getImages({
    groupId: filters.search.groupId,
    tagIds: filters.search.tagIds,
    keyword: filters.search.keyword,
  });

  return (
    <main>
      <SharedProvider availableGroups={availableGroups} availableTags={availableTags}>
        <ImagesModule images={images} filters={filters} />
      </SharedProvider>
    </main>
  );
};

export default ImagesPage;
