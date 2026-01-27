import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { UTM_PARAMS } from "@/constants/site";
import { addQueryParams } from "@/lib/url";
import { Icons } from "./icons";

type GitHubStarsProps = {
  repo: string;
  stargazersCount: number;
};

export function GitHubStars({ repo, stargazersCount }: GitHubStarsProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            className="gap-1.5 pr-1.5 pl-2"
            variant="ghost"
            nativeButton={false}
            render={
              <a
                href={addQueryParams(`https://github.com/${repo}`, UTM_PARAMS)}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          />
        }
      >
        <Icons.github className="-translate-y-px" />
        <span className="text-[13px] text-muted-foreground tabular-nums">
          {new Intl.NumberFormat("en-US", {
            notation: "compact",
            compactDisplay: "short",
          })
            .format(stargazersCount)
            .toLowerCase()}
        </span>
      </TooltipTrigger>

      <TooltipContent className="font-sans">
        {new Intl.NumberFormat("en-US").format(stargazersCount)} stars
      </TooltipContent>
    </Tooltip>
  );
}
