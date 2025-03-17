"use client";

import type { Group, Tag } from "@prisma/client";
import { createContext, ReactNode, useContext } from "react";

interface ImagesContextType {
  availableGroups: Group[];
  availableTags: Tag[];
}

const ImagesContext = createContext<ImagesContextType | undefined>(undefined);

export function ImagesProvider({
  children,
  availableGroups,
  availableTags,
}: {
  children: ReactNode;
  availableGroups: Group[];
  availableTags: Tag[];
}) {
  return (
    <ImagesContext.Provider value={{ availableGroups, availableTags }}>
      {children}
    </ImagesContext.Provider>
  );
}

export function useImages() {
  const context = useContext(ImagesContext);
  if (context === undefined) {
    throw new Error("useImages must be used within an ImagesProvider");
  }
  return context;
} 