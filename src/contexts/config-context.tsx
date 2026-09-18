"use client";

import type { ChangeEvent, ReactNode } from "react";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import type { z } from "zod";

import type { ExportFormat, ExportQuality } from "@/constants/export";
import {
  DEFAULT_EXPORT_FORMAT,
  DEFAULT_EXPORT_QUALITY,
} from "@/constants/export";
import { RANDOM_NAMES } from "@/constants/site";
import { parseFollowersCSV } from "@/lib/csv-utils";
import { getDicebearUrl, shuffle } from "@/remotion/templates/shared/utils";
import type { CompositionProps, Follower, XTheme } from "@/types/schema";
import { defaultMyCompProps } from "@/types/schema";

export type DataSource = "manual" | "csv";

interface ConfigContextType {
  followerCount: number;
  setFollowerCount: (count: number) => void;
  theme: XTheme;
  setTheme: (theme: XTheme) => void;
  dataSource: DataSource;
  setDataSource: (source: DataSource) => void;
  csvFollowers: Follower[];
  csvError: string | null;
  isRandomizeEnabled: boolean;
  setIsRandomizeEnabled: (enabled: boolean) => void;
  exportFormat: ExportFormat;
  setExportFormat: (format: ExportFormat) => void;
  exportQuality: ExportQuality;
  setExportQuality: (quality: ExportQuality) => void;
  handleFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  inputProps: z.infer<typeof CompositionProps>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [followerCount, setFollowerCount] = useState<number>(
    defaultMyCompProps.followerCount
  );
  const [theme, setTheme] = useState<XTheme>(defaultMyCompProps.theme);
  const [dataSource, setDataSource] = useState<DataSource>("csv");
  const [csvFollowers, setCsvFollowers] = useState<Follower[]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [isRandomizeEnabled, setIsRandomizeEnabled] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>(
    DEFAULT_EXPORT_FORMAT
  );
  const [exportQuality, setExportQuality] = useState<ExportQuality>(
    DEFAULT_EXPORT_QUALITY
  );

  const generateRandomFollowers = useCallback((count: number) => {
    const shuffledNames = shuffle(RANDOM_NAMES);
    return Array.from({ length: Math.min(count, 50) }).map((_, i) => ({
      image: getDicebearUrl(`${i}-${Math.random()}`),
      name: shuffledNames[i % shuffledNames.length],
      verified: true,
    }));
  }, []);

  const activeFollowers = useMemo(() => {
    if (
      (dataSource === "csv" && !csvFollowers.length) ||
      dataSource === "manual"
    ) {
      return generateRandomFollowers(followerCount);
    }

    // CSV mode with uploaded data
    if (isRandomizeEnabled) {
      const shuffledNames = shuffle(RANDOM_NAMES);
      return csvFollowers.map((f, i) => ({
        ...f,
        name: shuffledNames[i % shuffledNames.length],
      }));
    }

    return csvFollowers;
  }, [
    dataSource,
    csvFollowers,
    isRandomizeEnabled,
    followerCount,
    generateRandomFollowers,
  ]);

  const inputProps = useMemo(
    () => ({
      followerCount,
      followers: activeFollowers,
      theme,
    }),
    [followerCount, theme, activeFollowers]
  );

  const handleFileUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        return;
      }

      const text = await file.text();
      if (!text) {
        return;
      }

      const { followers, error } = parseFollowersCSV(text);

      if (error) {
        setCsvError(error);
        return;
      }

      setCsvError(null);
      setCsvFollowers(followers);
      setFollowerCount(followers.length);
    },
    []
  );

  const value = useMemo(
    () => ({
      csvError,
      csvFollowers,
      dataSource,
      exportFormat,
      exportQuality,
      followerCount,
      handleFileUpload,
      inputProps,
      isRandomizeEnabled,
      setDataSource,
      setExportFormat,
      setExportQuality,
      setFollowerCount,
      setIsRandomizeEnabled,
      setTheme,
      theme,
    }),
    [
      followerCount,
      theme,
      dataSource,
      csvFollowers,
      csvError,
      isRandomizeEnabled,
      exportFormat,
      exportQuality,
      handleFileUpload,
      inputProps,
    ]
  );

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
