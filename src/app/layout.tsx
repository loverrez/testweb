import type { Metadata, ResolvingMetadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import MainContentWrapper from "@/components/MainContentWrapper";
import { supabase } from "@/lib/supabase";

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  const siteLogo = data?.site_logo || '/favicon.ico';
  const cacheBust = data?.updated_at ? encodeURIComponent(data.updated_at) : '1';
  const logoHref = siteLogo === '/favicon.ico'
    ? siteLogo
    : `${siteLogo}${siteLogo.includes('?') ? '&' : '?'}v=${cacheBust}`;
  const siteName = data?.site_name || "NextWeb - Black & Red Edition";
  const siteDesc = data?.site_description || "Modern web with Next.js";

  return {
    title: siteName,
    description: siteDesc,
    openGraph: {
      title: siteName,
      description: siteDesc,
      images: data?.site_logo ? [data.site_logo] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: siteDesc,
      images: data?.site_logo ? [data.site_logo] : [],
    },
    icons: {
      icon: logoHref,
      shortcut: logoHref,
      apple: logoHref,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  const siteLogo = data?.site_logo || '/favicon.ico';
  const cacheBust = data?.updated_at ? encodeURIComponent(data.updated_at) : '1';
  const logoHref = siteLogo === '/favicon.ico'
    ? siteLogo
    : `${siteLogo}${siteLogo.includes('?') ? '&' : '?'}v=${cacheBust}`;

  return (
    <html lang="en">
      <head>
        <link rel="icon" href={logoHref} />
        <link rel="shortcut icon" href={logoHref} />
        <link rel="apple-touch-icon" href={logoHref} />
      </head>
      <body
        className={`${prompt.variable} font-prompt antialiased bg-black text-white`}
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
