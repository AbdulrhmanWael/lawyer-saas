"use client";

import { PracticeAreasProvider } from "../context/PracticeAreaContext";

export default function PracticeAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PracticeAreasProvider>{children}</PracticeAreasProvider>;
}
