import { ReactNode } from "react";

interface ResourceModuleProps {
  children: ReactNode;
  header: ReactNode;
  filters: ReactNode;
  toggles: ReactNode;
  appliedFilters: ReactNode;
}

const ResourceModule = ({ children, header, filters, toggles, appliedFilters }: ResourceModuleProps) => {
  return (
    <div className="flex flex-col">
      <section className="px-8 py-6 flex justify-between items-center w-full">
        {header}
      </section>

      <section className="px-8 py-2 flex flex-col gap-4">
        <div className="flex justify-between items-center w-full flex-wrap gap-4">
          <div className="flex items-center gap-2">
            {filters}
          </div>

          <div className="flex gap-4">
            {toggles}
          </div>
        </div>

        {appliedFilters}
      </section>

      {children}
    </div>
  );
}

export default ResourceModule;