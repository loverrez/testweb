'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ConditionalNavbar({ siteName }: { siteName: string }) {
  const pathname = usePathname();
  
  // Hide main navbar on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return <Navbar siteName={siteName} />;
}
