import { getImages } from "@/data/images";

import ImagesModule from "./_components/ImagesModule";
import { ImageGroupView, ImageView } from "./constants";

interface ImagesPageProps {
  searchParams: {
    view?: string;
    groupView?: string;
  };
}

const ImagesPage = async ({ searchParams }: ImagesPageProps) => {
  const viewParam = searchParams.view;
  const groupViewParam = searchParams.groupView;

  const isValidView = Object.values(ImageView).includes(viewParam as ImageView);
  const view = isValidView ? viewParam as ImageView : ImageView.GRID;

  const isValidGroupView = Object.values(ImageGroupView).includes(groupViewParam as ImageGroupView);
  const groupView = isValidGroupView ? groupViewParam as ImageGroupView : ImageGroupView.SINGLE;

  const images = await getImages();

  return (
    <main>
      <ImagesModule
        images={images}
        view={view}
        groupView={groupView}
      />
    </main>
  );
};

export default ImagesPage;
