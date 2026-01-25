"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ChangeEvent,
  ReactNode,
  useCallback,
} from "react";
import { z } from "zod";
import {
  defaultMyCompProps,
  CompositionProps,
  XTheme,
  Follower,
} from "@/types/constants";
import { parseFollowersCSV } from "@/lib/csv-utils";
import { getDicebearUrl, shuffle } from "@/remotion/follower-accumulation/utils";
import { RANDOM_NAMES } from "@/constants";

export type DataSource = "manual" | "csv";

interface ConfigContextType {
  followerCount: number;
  setFollowerCount: (count: number) => void;
  theme: XTheme;
  setTheme: (theme: XTheme) => void;
  dataSource: DataSource;
  setDataSource: (source: DataSource) => void;
  csvFollowers: Follower[];
  isRandomizeEnabled: boolean;
  setIsRandomizeEnabled: (enabled: boolean) => void;
  handleFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  inputProps: z.infer<typeof CompositionProps>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [followerCount, setFollowerCount] = useState<number>(
    defaultMyCompProps.followerCount,
  );
  const [theme, setTheme] = useState<XTheme>(defaultMyCompProps.theme);
  const [dataSource, setDataSource] = useState<DataSource>("csv");
  const [csvFollowers, setCsvFollowers] = useState<Follower[]>([]);
  const [isRandomizeEnabled, setIsRandomizeEnabled] = useState(false);

  const generateRandomFollowers = useCallback((count: number) => {
    const shuffledNames = shuffle(RANDOM_NAMES);
    return Array.from({ length: Math.min(count, 50) }).map((_, i) => ({
      name: shuffledNames[i % shuffledNames.length],
      image: getDicebearUrl(`${i}-${Math.random()}`),
      verified: true,
    }));
  }, []);

  const activeFollowers = useMemo(() => {
    if ((dataSource === "csv" && !csvFollowers.length) || dataSource === "manual") {
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
      theme,
      followers: activeFollowers,
    }),
    [followerCount, theme, activeFollowers],
  );

  const handleFileUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const text = await file.text();
      if (!text) return;

      const { followers, error } = await parseFollowersCSV(text);

      if (error) {
        alert(error);
        return;
      }

      setCsvFollowers(followers);
      setFollowerCount(followers.length);
    },
    [],
  );

  const value = useMemo(
    () => ({
      followerCount,
      setFollowerCount,
      theme,
      setTheme,
      dataSource,
      setDataSource,
      csvFollowers,
      isRandomizeEnabled,
      setIsRandomizeEnabled,
      handleFileUpload,
      inputProps,
    }),
    [
      followerCount,
      theme,
      dataSource,
      csvFollowers,
      isRandomizeEnabled,
      handleFileUpload,
      inputProps,
    ],
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
