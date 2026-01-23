import { ConfigProvider } from "@/contexts/config-context";
import { HeroSection } from "@/components/home/hero-section";
import { ConfigurationSection } from "@/components/home/configuration-section";
import { PreviewSection } from "@/components/home/preview-section";

export default function Home() {
  return (
    <ConfigProvider>
      <main className="px-4 py-12">
        <HeroSection />
        <div className="space-y-8">
          <ConfigurationSection />
          <PreviewSection />
        </div>
      </main>
    </ConfigProvider>
  );
}
