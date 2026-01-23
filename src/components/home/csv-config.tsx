"use client";

import { useConfig } from "@/contexts/config-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { FollowersListDialog } from "./followers-list-dialog";
import { memo } from "react";
import { Checkbox } from "../ui/checkbox";

export const CSVConfig = memo(function CSVConfig() {
  const {
    csvFollowers,
    isRandomizeEnabled,
    setIsRandomizeEnabled,
    handleFileUpload,
  } = useConfig();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Upload CSV File</Label>
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
        <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400">
          <Info className="h-4 w-4" />
          <AlertTitle>Followers CSV Export</AlertTitle>
          <AlertDescription className="text-blue-600/80 dark:text-blue-400/80">
            <p>
              Use the{" "}
              <a
                href="https://chromewebstore.google.com/detail/twitter-exporter/lnklhjfbeicncichppfbhjijodjgaejm"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4 hover:!text-blue-800 dark:hover:text-blue-300"
              >
                Twitter Exporter
              </a>{" "}
              chrome extension to download your followers CSV. The extension
              automatically includes the required <strong>name</strong> and{" "}
              <strong>avatar_image_url</strong> columns.
            </p>
          </AlertDescription>
        </Alert>
      </div>

      <Label className="flex items-start gap-2 rounded-md border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
        <Checkbox
          checked={isRandomizeEnabled}
          onCheckedChange={setIsRandomizeEnabled}
        />
        <div className="flex flex-col gap-1">
          <p>Randomize Names</p>
          <p className="text-muted-foreground text-xs">
            Ignore CSV names and use generated ones
          </p>
        </div>
      </Label>

      {csvFollowers.length > 0 && (
        <div className="p-4 bg-muted rounded-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Loaded {csvFollowers.length} followers
            </p>
            <FollowersListDialog followers={csvFollowers} />
          </div>
          <div className="text-xs text-muted-foreground max-h-32 overflow-y-auto pt-2">
            <ul className="list-disc pl-4 space-y-1">
              {csvFollowers.slice(0, 3).map((f, i) => (
                <li key={i}>
                  {f.name} {f.image ? "(with image)" : ""}
                </li>
              ))}
              {csvFollowers.length > 5 && (
                <li className="list-none pt-1 font-medium italic">
                  ...and {csvFollowers.length - 3} more
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
});
