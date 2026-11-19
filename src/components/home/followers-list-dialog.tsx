import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { memo } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Follower } from "@/types/schema";

interface FollowersListDialogProps {
  followers: Follower[];
  source: string;
}

export const FollowersListDialog = memo(
  ({ followers, source }: FollowersListDialogProps) => (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="xs">
            <ExternalLink data-icon="inline-start" />
            View All
          </Button>
        }
      />
      <DialogContent className="flex max-h-[80vh] max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle>Followers List</DialogTitle>
          <DialogDescription>
            Showing {followers.length} followers from {source}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2">
          <table className="w-full text-sm">
            <thead className="bg-background sticky top-0 z-10 border-b">
              <tr className="text-muted-foreground text-left">
                <th className="pb-2 font-medium">Avatar</th>
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Image URL</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {followers.map((f, i) => (
                <tr
                  key={i}
                  className="group hover:bg-muted/50 transition-colors"
                >
                  <td className="py-2 pr-4">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border">
                      {f.image ? (
                        <Image
                          src={f.image}
                          alt={f.name}
                          width={32}
                          height={32}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-muted-foreground text-[10px]">
                          {f.name.slice(0, 2)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 pr-4 font-medium">{f.name}</td>
                  <td className="py-2">
                    <span
                      className="text-muted-foreground block max-w-[200px] truncate text-xs"
                      title={f.image}
                    >
                      {f.image || "N/A"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
);

FollowersListDialog.displayName = "FollowersListDialog";
