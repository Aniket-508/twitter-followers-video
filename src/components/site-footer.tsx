import { Twitter } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="flex items-center justify-between py-6 text-xs text-muted-foreground border-t border-border">
      <p>Not endorsed or affiliated by X</p>
      <a
        href="https://twitter.com/im_aniketpawar"
        target="_blank"
        rel="noreferrer"
        className="hover:text-foreground transition-colors"
      >
        <Twitter className="h-4 w-4" />
      </a>
    </footer>
  );
}
