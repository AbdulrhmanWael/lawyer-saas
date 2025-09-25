"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import {
  practiceAreaService,
  type PracticeArea,
} from "@/services/practiceAreaService";
import { SiteSettings, siteSettingsApi } from "@/services/siteSettings";
import { applyThemeColors } from "@/utils/applyThemeColors";
import { normalizeField } from "../admin/practice-areas/edit/[slug]/PracticeAreaForm";

interface SiteContextType {
  siteSettings: SiteSettings | null;
  practiceAreas: PracticeArea[];
  loading: boolean;
  refreshSiteSettings: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType>({
  siteSettings: null,
  practiceAreas: [],
  loading: true,
  refreshSiteSettings: async () => {},
});

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [practiceAreas, setPracticeAreas] = useState<PracticeArea[]>([]);
  const [loading, setLoading] = useState(true);

  const normalizePracticeArea = (pa: PracticeArea): PracticeArea => ({
    ...pa,
    title: normalizeField(pa.title),
    excerpt: normalizeField(pa.excerpt),
    contentHtml: normalizeField(pa.contentHtml),
    seoMeta: normalizeField(pa.seoMeta),
  });

  const fetchSiteSettings = async () => {
    try {
      const data = await siteSettingsApi.get();
      setSettings(data || null);

      if (data) {
        applyThemeColors(data); // apply CSS variables whenever settings change
      }
    } catch (err) {
      console.error("Failed to fetch site settings", err);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsData, services] = await Promise.all([
          siteSettingsApi.get(),
          practiceAreaService.getAll(),
        ]);

        setSettings(settingsData || null);
        setPracticeAreas(services.map(normalizePracticeArea)); // 👈 normalize here

        if (settingsData) {
          applyThemeColors(settingsData);
        }
      } catch (err) {
        console.error("Failed to fetch site data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const contextValue = useMemo(
    () => ({
      siteSettings: settings,
      practiceAreas,
      loading,
      refreshSiteSettings: fetchSiteSettings,
    }),
    [settings, practiceAreas, loading]
  );

  return (
    <SiteContext.Provider value={contextValue}>{children}</SiteContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteContext);
}
