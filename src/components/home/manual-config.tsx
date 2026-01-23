"use client";

import { useConfig } from "@/contexts/config-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { memo } from "react";

export const ManualConfig = memo(function ManualConfig() {
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
