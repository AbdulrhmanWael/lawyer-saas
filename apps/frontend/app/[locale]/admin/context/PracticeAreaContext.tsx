"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { PracticeArea } from "@/services/practiceAreaService";

interface PracticeAreasContextValue {
  selectedPracticeArea?: PracticeArea;
  setSelectedPracticeArea: (pa: PracticeArea | undefined) => void;
}

const PracticeAreasContext = createContext<
  PracticeAreasContextValue | undefined
>(undefined);

export const PracticeAreasProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedPracticeArea, setSelectedPracticeArea] = useState<
    PracticeArea | undefined
  >(undefined);

  const contextValue = useMemo(
    () => ({ selectedPracticeArea, setSelectedPracticeArea }),
    [selectedPracticeArea, setSelectedPracticeArea]
  );

  return (
    <PracticeAreasContext.Provider value={contextValue}>
      {children}
    </PracticeAreasContext.Provider>
  );
};

export const usePracticeAreas = () => {
  const context = useContext(PracticeAreasContext);
  if (!context)
    throw new Error(
      "usePracticeAreas must be used within PracticeAreasProvider"
    );
  return context;
};
