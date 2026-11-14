import "./globals.css";
import DesktopSiteHeader from "@/components/DesktopSiteHeader";

export const metadata = {
  title: "AskEnugu — Your Government Information Hub",
  description:
    "A proposed independent public-interest platform for finding, understanding and verifying government information in Enugu State.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-[#E8F5E9]">
      <head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.css"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#1F2C35] antialiased selection:bg-[#E8A812] selection:text-[#082C20]">
        <DesktopSiteHeader />
        <div className="pt-16">{children}</div>
      </body>
    </html>
  );
}
