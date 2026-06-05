import './globals.css';
import type { Metadata } from "next";
import SessionProvider from "../lib/SessionProvider";
import MainNavigation from '../components/layout/main-navigation';
import ReduxProvider from '../lib/ReduxProvider';
import FavoritesProvider from '../components/favorites-provider';
import FilterNavigation from '../components/layout/filter-navigation';
import { Red_Hat_Display } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "StyleMe",
  description: "Style yourself in your favorite clothes using AI",
  keywords: ["clothing", "fashion", "AI", "store"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Analytics />
      <SpeedInsights />
      <body className={redHatDisplay.className}>
        <SessionProvider>
          <ReduxProvider>
            <FavoritesProvider />
            <MainNavigation />
            <FilterNavigation />
            {children}
            <Toaster position='top-right' toastOptions={{ duration: 3000 }} />
          </ReduxProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
