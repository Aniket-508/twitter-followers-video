"use client";

import { memo } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConfig } from "@/contexts/config-context";

export const ManualConfig = memo(() => {
  const { followerCount, setFollowerCount } = useConfig();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Follower Count</Label>
        <Input
          type="number"
          value={followerCount}
          onChange={(e) => setFollowerCount(Number(e.target.value) || 0)}
          min={1}
        />
        <p className="text-xs text-muted-foreground">
          Follower names and avatars will be randomized by default
        </p>
      </div>
    </div>
  );
});

ManualConfig.displayName = "ManualConfig";
