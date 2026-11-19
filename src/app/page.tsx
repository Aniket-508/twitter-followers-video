import { ConfigurationSection } from "@/components/home/configuration-section";
import { PreviewSection } from "@/components/home/preview-section";
import { ConfigProvider } from "@/contexts/config-context";

export default function Home() {
  return (
    <ConfigProvider>
      <main className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-3">
        <div className="border-b lg:col-span-1 lg:border-r lg:border-b-0">
          <ConfigurationSection />
        </div>
        <div className="lg:col-span-2">
          <PreviewSection />
        </div>
      </main>
    </ConfigProvider>
  );
}
