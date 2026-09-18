import { ConfigurationSection } from "@/components/home/configuration-section";
import { PreviewSection } from "@/components/home/preview-section";
import { ConfigProvider } from "@/contexts/config-context";

export default function Home() {
  return (
    <ConfigProvider>
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-0">
        <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r">
          <ConfigurationSection />
        </div>
        <div className="lg:col-span-2">
          <PreviewSection />
        </div>
      </main>
    </ConfigProvider>
  );
}
