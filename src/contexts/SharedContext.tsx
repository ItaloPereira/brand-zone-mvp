"use client";

import type { Group, Tag } from "@prisma/client";
import { createContext, ReactNode, useContext } from "react";

interface SharedContextType {
  availableGroups: Group[];
  availableTags: Tag[];
}

const SharedContext = createContext<SharedContextType | undefined>(undefined);

export function SharedProvider({
  children,
  availableGroups,
  availableTags,
}: {
  children: ReactNode;
  availableGroups: Group[];
  availableTags: Tag[];
}) {
  return (
    <SharedContext.Provider value={{ availableGroups, availableTags }}>
      {children}
    </SharedContext.Provider>
  );
}

export function useShared() {
  const context = useContext(SharedContext);
  if (context === undefined) {
    throw new Error("useShared must be used within an SharedProvider");
  }
  return context;
} 