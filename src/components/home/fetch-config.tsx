"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { memo } from "react";

import { FollowersListDialog } from "@/components/home/followers-list-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConfig } from "@/contexts/config-context";
import { normalizeHandle } from "@/lib/followers-api";

export const FetchConfig = memo(() => {
  const {
    fetchError,
    fetchHandle,
    fetchHasMore,
    fetchStatus,
    fetchedFollowers,
    followerCount,
    handleFetchFollowers,
    handleLoadMoreFollowers,
    isLoadingMore,
    isRandomizeEnabled,
    setFetchHandle,
    setIsRandomizeEnabled,
  } = useConfig();

  const isLoading = fetchStatus === "loading";
  const loadedCount = fetchedFollowers.length;
  const showError = Boolean(fetchError);

  return (
    <div className="space-y-4">
      <form
        className="space-y-2"
        onSubmit={(event) => {
          event.preventDefault();
          handleFetchFollowers();
        }}
      >
        <Label htmlFor="fetch-handle">X Username</Label>
        <div className="flex gap-2">
          <Input
            id="fetch-handle"
            placeholder="e.g. elonmusk"
            value={fetchHandle}
            onChange={(event) => setFetchHandle(event.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <Button
            type="submit"
            disabled={isLoading || fetchHandle.trim().length === 0}
          >
            {isLoading ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : null}
            {isLoading ? "Fetching..." : "Fetch"}
          </Button>
        </div>
        <p className="text-muted-foreground text-xs">
          Pulls the account&apos;s real followers, no export needed
        </p>
      </form>

      {isLoading ? (
        <p className="text-muted-foreground text-xs">Fetching followers...</p>
      ) : null}

      {showError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Could not fetch followers</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      ) : null}

      <Label className="hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50 flex items-start gap-2 rounded-md border p-3">
        <Checkbox
          checked={isRandomizeEnabled}
          onCheckedChange={setIsRandomizeEnabled}
        />
        <div className="flex flex-col gap-1">
          <p>Randomize Names</p>
          <p className="text-muted-foreground text-xs">
            Ignore fetched names and use generated ones
          </p>
        </div>
      </Label>

      {loadedCount > 0 ? (
        <div className="bg-muted rounded-md p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium">
              Loaded {loadedCount.toLocaleString()} of{" "}
              {followerCount.toLocaleString()} followers
            </p>
            <FollowersListDialog
              followers={fetchedFollowers}
              source={`@${normalizeHandle(fetchHandle)}`}
            />
          </div>
          {followerCount > loadedCount ? (
            <p className="text-muted-foreground pt-2 text-xs">
              The video counter will use the real total of{" "}
              {followerCount.toLocaleString()} followers.
            </p>
          ) : null}
          {fetchHasMore ? (
            <div className="flex items-center justify-between gap-2 pt-3">
              <p className="text-muted-foreground text-xs">
                Showing the first {loadedCount.toLocaleString()} - enough for
                the video
              </p>
              <Button
                variant="outline"
                size="xs"
                onClick={handleLoadMoreFollowers}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                ) : null}
                {isLoadingMore ? "Loading..." : "Load more"}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
});

FetchConfig.displayName = "FetchConfig";
