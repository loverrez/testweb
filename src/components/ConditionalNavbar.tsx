'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ConditionalNavbar({ 
  siteName, 
  siteLogo 
}: { 
  siteName: string;
  siteLogo: string;
}) {
  const pathname = usePathname();
  
  // Hide main navbar on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // On landing page, show navbar without site name and logo
  if (pathname === '/') {
    return <Navbar />;
  }

  return <Navbar siteName={siteName} siteLogo={siteLogo} />;
}
