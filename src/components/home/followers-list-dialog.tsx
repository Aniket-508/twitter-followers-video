import type { Follower } from "@/types/constants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";
import { memo } from "react";

interface FollowersListDialogProps {
  followers: Follower[];
}

export const FollowersListDialog = memo(function FollowersListDialog({
  followers,
}: FollowersListDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="xs">
            <ExternalLink data-icon="inline-start" />
            View All
          </Button>
        }
      />
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Followers List</DialogTitle>
          <DialogDescription>
            Showing all {followers.length} followers from the uploaded CSV
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-background border-b z-10">
              <tr className="text-left text-muted-foreground">
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
                    <div className="h-8 w-8 rounded-full overflow-hidden border bg-muted flex items-center justify-center">
                      {f.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={f.image}
                          alt={f.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-muted-foreground">
                          {f.name.slice(0, 2)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 pr-4 font-medium">{f.name}</td>
                  <td className="py-2">
                    <span
                      className="text-xs text-muted-foreground truncate max-w-[200px] block"
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
  );
});
