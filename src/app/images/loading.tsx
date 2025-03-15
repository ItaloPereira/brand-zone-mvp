import { Skeleton } from '@/components/ui/skeleton';

const ImagesLoading = () => {
  return (
    <>
      <section className="px-8 py-6 flex justify-between items-center w-full">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-28" />
      </section>

      <section className="px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="aspect-[4/3] px-3 pb-3 bg-muted rounded-md">
              <div className="flex justify-between items-center py-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <div className="relative h-[calc(100%-40px)] rounded-xs overflow-hidden">
                <Skeleton className="h-full w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ImagesLoading;