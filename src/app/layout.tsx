import ReduxProvider from "@/lib/ReduxProvider";
import { allkeywords, descriptionShop } from "@/lib/contstens";
import { cn } from "@/lib/utils";
import Script from "next/script";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fablura",
  description: descriptionShop,
  keywords: allkeywords,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(poppins.className, "w-full")}>
        <ReduxProvider>
          <div className="max-w-[1400px] mx-auto">
            {children}
            <Toaster position="top-center" reverseOrder={false} />
          </div>
        </ReduxProvider>
      </body>
      <GoogleTagManager gtmId="GTM-5TFNXQCX" />
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-5TFNXQCX"
          height="0"
          width="0"
          style={{ display: "none" }}
        ></iframe>
      </noscript>
    </html>
  );
}
