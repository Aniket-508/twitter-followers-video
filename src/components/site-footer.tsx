import { SITE } from "@/constants/site";

export const SiteFooter = () => (
  <footer className="mt-auto border-t">
    <div className="text-muted-foreground flex items-center justify-between p-4 text-xs">
      <p>
        Built by{" "}
        <a
          href="https://aniketpawar.com"
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground font-medium transition-colors"
        >
          {SITE.AUTHOR.NAME}
        </a>
      </p>
      <p>Not endorsed or affiliated by X</p>
    </div>
  </footer>
);
