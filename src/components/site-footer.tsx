import { Icons } from "./icons";
import { SITE } from "@/constants/site";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="px-4 flex items-center justify-between py-4 text-xs text-muted-foreground">
        <p>Not endorsed or affiliated by X</p>
        <a
          href={`https://x.com/${SITE.AUTHOR.TWITTER}`}
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground transition-colors"
        >
          <Icons.x className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
}
