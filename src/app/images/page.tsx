import { getImages } from "@/data/images";
import { getGroups, getTags } from "@/data/shared";

import ImagesModule from "./_components/ImagesModule";
import { getFilters } from "./_utils/filters";

interface ImagesPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const ImagesPage = async ({ searchParams }: ImagesPageProps) => {
  const availableGroups = await getGroups();
  const availableTags = await getTags();

  const filters = getFilters(searchParams, {
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
      <ImagesModule
        images={images}
        filters={filters}
        availableGroups={availableGroups}
        availableTags={availableTags}
      />
    </main>
  );
};

export default ImagesPage;
