"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
  useRef,
  useCallback,
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

  // 🧠 Track whether theme was already applied by SSR or script
  const themeAppliedRef = useRef(false);

  const normalizePracticeArea = (pa: PracticeArea): PracticeArea => ({
    ...pa,
    title: normalizeField(pa.title),
    excerpt: normalizeField(pa.excerpt),
    contentHtml: normalizeField(pa.contentHtml),
    seoMeta: normalizeField(pa.seoMeta),
  });

  const applyThemeSafely = (data: SiteSettings) => {
    if (!data) return;
    if (themeAppliedRef.current) {
      applyThemeColors(data);
    } else {
      themeAppliedRef.current = true;
    }
    try {
      document.cookie = `siteSettings=${encodeURIComponent(
        JSON.stringify(data)
      )}; path=/; max-age=86400;`;
    } catch (err) {
      console.warn("Failed to store siteSettings cookie:", err);
    }
  };

  const fetchSiteSettings = useCallback(async () => {
    try {
      const data = await siteSettingsApi.get();
      setSettings(data || null);
      if (data) applyThemeSafely(data);
    } catch (err) {
      console.error("Failed to fetch site settings", err);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsData, services] = await Promise.all([
          siteSettingsApi.get(),
          practiceAreaService.getAll(),
        ]);

        setSettings(settingsData || null);
        setPracticeAreas(services.map(normalizePracticeArea));
        if (settingsData) applyThemeSafely(settingsData);
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
    [settings, practiceAreas, loading, fetchSiteSettings]
  );

  return (
    <SiteContext.Provider value={contextValue}>{children}</SiteContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteContext);
}
