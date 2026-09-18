import type { Viewport } from "next";
import { Playfair_Display, Public_Sans } from "next/font/google";

import "../../styles/global.css";
import Script from "next/script";

import { Providers } from "@/app/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JsonLdScripts } from "@/seo/json-ld";

export { baseMetadata as metadata } from "@/seo/metadata";

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });

const playfairDisplay = Playfair_Display({
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  width: "device-width",
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
      <body
        className={`${playfairDisplay.variable} font-sans antialiased flex flex-col min-h-screen relative view-container`}
      >
        <Providers>
          <div className="bg-stripes absolute border-r bottom-0 left-0 top-0 flex h-full min-h-screen w-2 flex-col sm:w-4" />
          <SiteHeader />
          {children}
          <SiteFooter />
          <div className="bg-stripes absolute border-l bottom-0 right-0 top-0 flex h-full min-h-screen w-2 flex-col sm:w-4" />
        </Providers>
      </body>
    </html>
  );
}
