'use client';

import { usePathname } from 'next/navigation';

export default function MainContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <main className={isAdmin ? '' : 'pt-32'}>
      {children}
    </main>
  );
}
