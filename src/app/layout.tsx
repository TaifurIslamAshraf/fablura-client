import ReduxProvider from "@/lib/ReduxProvider";
import { allkeywords, descriptionShop } from "@/lib/contstens";
import { cn } from "@/lib/utils";
import Script from "next/script";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

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
            <Script id="facebook-pixel" strategy="afterInteractive">
              {`
          !function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '905675795011269');
fbq('track', 'PageView');
        `}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src="https://www.facebook.com/tr?id=905675795011269&ev=PageView&noscript=1"
              />
            </noscript>
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
