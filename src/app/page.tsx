import { ConfigurationSection } from "@/components/home/configuration-section";
import { HeroSection } from "@/components/home/hero-section";
import { PreviewSection } from "@/components/home/preview-section";
import { ConfigProvider } from "@/contexts/config-context";

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
