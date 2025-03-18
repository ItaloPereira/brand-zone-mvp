import { SharedProvider } from "@/contexts/SharedContext";
import { getPalettes } from "@/data/palettes";
import { getGroups, getTags } from "@/data/shared";

import PalettesModule from "./_components/PalettesModule";
import { getPaletteFilters } from "./_utils/filters";

interface PalettesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const PalettesPage = async ({ searchParams }: PalettesPageProps) => {
  const availableGroups = await getGroups();
  const availableTags = await getTags();

  const filters = getPaletteFilters(await searchParams, {
    availableGroups,
    availableTags,
  });

  const palettes = await getPalettes({
    groupId: filters.search.groupId,
    tagIds: filters.search.tagIds,
    keyword: filters.search.keyword,
  });

  return (
    <main>
      <SharedProvider availableGroups={availableGroups} availableTags={availableTags}>
        <PalettesModule palettes={palettes} filters={filters} />
      </SharedProvider>
    </main>
  );
};

export default PalettesPage;
