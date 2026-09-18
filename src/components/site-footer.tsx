import { SITE } from "@/constants/site";

export const SiteFooter = () => (
  <footer className="border-t mt-auto">
    <div className="flex items-center justify-between p-4 text-xs text-muted-foreground">
      <p>
        Built by{" "}
        <a
          href="https://aniketpawar.com"
          target="_blank"
          rel="noreferrer"
          className="font-medium hover:text-foreground transition-colors"
        >
          {SITE.AUTHOR.NAME}
        </a>
      </p>
      <p>Not endorsed or affiliated by X</p>
    </div>
  </footer>
);
