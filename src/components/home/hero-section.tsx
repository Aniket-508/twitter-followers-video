import { SITE } from "@/constants/site";

export function HeroSection() {
  return (
    <div className="space-y-2 mb-12 text-center sm:text-left">
      <h1 className="text-4xl font-serif italic text-foreground">
        {SITE.NAME}
      </h1>
      <p className="text-muted-foreground text-lg">{SITE.DESCRIPTION}</p>
    </div>
  );
}
