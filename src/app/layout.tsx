import type { Metadata, ResolvingMetadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import MainContentWrapper from "@/components/MainContentWrapper";
import { supabase } from "@/lib/supabase";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  // Fetch site settings from Supabase
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  return {
    title: data?.site_name || "NextWeb - Black & Red Edition",
    description: data?.site_description || "Modern web with Next.js",
    openGraph: {
      title: data?.site_name || "NextWeb",
      description: data?.site_description || "Modern web with Next.js",
      images: data?.site_logo ? [data.site_logo] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: data?.site_name || "NextWeb",
      description: data?.site_description || "Modern web with Next.js",
      images: data?.site_logo ? [data.site_logo] : [],
    },
    icons: {
      icon: data?.site_logo || '/favicon.ico',
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch site settings for UI
  const { data } = await supabase
    .from('site_settings')
    .select('site_name, site_logo')
    .single();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <div className="bg-3d-grid" />
        <ConditionalNavbar 
          siteName={data?.site_name || "NextWeb"} 
          siteLogo={data?.site_logo || ""}
        />
        <MainContentWrapper>
          {children}
        </MainContentWrapper>
      </body>
    </html>
  );
}
