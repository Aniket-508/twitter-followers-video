import { Playfair_Display, Public_Sans } from "next/font/google";
import Script from "next/script";
import "../../styles/global.css";
import { Viewport } from "next";
import { Providers } from "./providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JsonLdScripts } from "@/seo/json-ld";
import { baseMetadata } from "@/seo/metadata";

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata = baseMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
  maximumScale: 1,
  minimumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={publicSans.variable}>
      <head>
        <JsonLdScripts />
        <Script id="clarity-tracking" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.CLARITY_ID}");
          `}
        </Script>
      </head>
      <body className={`${playfairDisplay.variable} font-sans antialiased`}>
        <Providers>
          <div className="relative view-container">
            <div className="bg-stripes absolute bottom-0 right-0 top-0 flex h-full min-h-screen w-2 flex-col sm:w-4" />
            <div className="border-x">
              <SiteHeader />
              {children}
              <SiteFooter />
            </div>
            <div className="bg-stripes absolute bottom-0 right-0 top-0 flex h-full min-h-screen w-2 flex-col sm:w-4" />
          </div>
        </Providers>
      </body>
    </html>
  );
}
