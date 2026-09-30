"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import type { z } from "zod";

import type { ExportFormat, ExportQuality } from "@/constants/export";
import {
  DEFAULT_EXPORT_FORMAT,
  DEFAULT_EXPORT_QUALITY,
} from "@/constants/export";
import { RANDOM_NAMES } from "@/constants/site";
import {
  FETCH_MAX_FOLLOWERS,
  isValidHandle,
  normalizeHandle,
  requestFollowersPage,
} from "@/lib/followers-api";
import { getDicebearUrl, shuffle } from "@/remotion/templates/shared/utils";
import type { CompositionProps, Follower, XTheme } from "@/types/schema";
import { defaultMyCompProps } from "@/types/schema";

type FetchStatus = "idle" | "loading" | "success" | "error";

interface ConfigContextType {
  followerCount: number;
  theme: XTheme;
  setTheme: (theme: XTheme) => void;
  isRandomizeEnabled: boolean;
  setIsRandomizeEnabled: (enabled: boolean) => void;
  exportFormat: ExportFormat;
  setExportFormat: (format: ExportFormat) => void;
  exportQuality: ExportQuality;
  setExportQuality: (quality: ExportQuality) => void;
  fetchHandle: string;
  setFetchHandle: (handle: string) => void;
  fetchStatus: FetchStatus;
  fetchError: string | null;
  fetchedFollowers: Follower[];
  fetchHasMore: boolean;
  isLoadingMore: boolean;
  handleFetchFollowers: () => void;
  handleLoadMoreFollowers: () => void;
  inputProps: z.infer<typeof CompositionProps>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [followerCount, setFollowerCount] = useState<number>(
    defaultMyCompProps.followerCount
  );
  const [theme, setTheme] = useState<XTheme>(defaultMyCompProps.theme);
  const [fetchHandle, setFetchHandle] = useState("");
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("idle");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchedFollowers, setFetchedFollowers] = useState<Follower[]>([]);
  const [fetchCursor, setFetchCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const fetchRequestIdRef = useRef(0);
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
    // Preview placeholder until an account is fetched
    if (fetchedFollowers.length === 0) {
      return generateRandomFollowers(followerCount);
    }

    if (isRandomizeEnabled) {
      const shuffledNames = shuffle(RANDOM_NAMES);
      return fetchedFollowers.map((f, i) => ({
        ...f,
        name: shuffledNames[i % shuffledNames.length],
      }));
    }

    return fetchedFollowers;
  }, [
    fetchedFollowers,
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

  const handleFetchFollowers = useCallback(async () => {
    const handle = normalizeHandle(fetchHandle);
    if (fetchStatus === "loading") {
      return;
    }
    if (!isValidHandle(handle)) {
      setFetchStatus("error");
      setFetchError(
        "Enter a valid X username (letters, numbers or underscores)."
      );
      return;
    }

    const requestId = fetchRequestIdRef.current + 1;
    fetchRequestIdRef.current = requestId;
    const isStale = () => fetchRequestIdRef.current !== requestId;

    setFetchStatus("loading");
    setIsLoadingMore(false);
    setFetchError(null);
    setFetchedFollowers([]);
    setFetchCursor(null);

    try {
      const page = await requestFollowersPage(handle);
      if (isStale()) {
        return;
      }
      if (page.followers.length === 0) {
        throw new Error(
          "This account has no followers available. It may be private."
        );
      }

      const followers = page.followers.slice(0, FETCH_MAX_FOLLOWERS);
      setFetchedFollowers(followers);
      setFollowerCount(page.profile?.followerCount ?? followers.length);
      setFetchCursor(page.cursor);
      setFetchStatus("success");
    } catch (error) {
      if (isStale()) {
        return;
      }
      setFetchedFollowers([]);
      setFetchCursor(null);
      setFetchError(
        error instanceof Error
          ? error.message
          : "Could not fetch followers for this account."
      );
      setFetchStatus("error");
    }
  }, [fetchHandle, fetchStatus]);

  const handleLoadMoreFollowers = useCallback(async () => {
    if (!fetchCursor || isLoadingMore) {
      return;
    }

    const handle = normalizeHandle(fetchHandle);
    const requestId = fetchRequestIdRef.current;
    const isStale = () => fetchRequestIdRef.current !== requestId;

    setIsLoadingMore(true);
    setFetchError(null);

    try {
      const page = await requestFollowersPage(handle, fetchCursor);
      if (isStale()) {
        return;
      }

      const merged = [...fetchedFollowers, ...page.followers];
      const capped = merged.slice(0, FETCH_MAX_FOLLOWERS);
      setFetchedFollowers(capped);
      setFetchCursor(capped.length >= FETCH_MAX_FOLLOWERS ? null : page.cursor);
      setFetchStatus("success");
    } catch (error) {
      if (isStale()) {
        return;
      }
      setFetchError(
        error instanceof Error
          ? error.message
          : "Could not load more followers."
      );
    } finally {
      if (!isStale()) {
        setIsLoadingMore(false);
      }
    }
  }, [fetchCursor, fetchHandle, fetchedFollowers, isLoadingMore]);

  const value = useMemo(
    () => ({
      exportFormat,
      exportQuality,
      fetchError,
      fetchHandle,
      fetchHasMore: fetchCursor !== null,
      fetchStatus,
      fetchedFollowers,
      followerCount,
      handleFetchFollowers,
      handleLoadMoreFollowers,
      inputProps,
      isLoadingMore,
      isRandomizeEnabled,
      setExportFormat,
      setExportQuality,
      setFetchHandle,
      setFollowerCount,
      setIsRandomizeEnabled,
      setTheme,
      theme,
    }),
    [
      followerCount,
      theme,
      fetchError,
      fetchHandle,
      fetchCursor,
      fetchStatus,
      fetchedFollowers,
      isLoadingMore,
      isRandomizeEnabled,
      exportFormat,
      exportQuality,
      handleFetchFollowers,
      handleLoadMoreFollowers,
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
