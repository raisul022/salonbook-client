'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardIndexPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if (isAdmin) {
        router.replace('/dashboard/admin');
      } else {
        router.replace('/dashboard/customer');
      }
    }
  }, [user, isAdmin, isLoading, router]);

  return (
    <div className="py-20 text-center text-xs text-stone-400">
      Redirecting to your dashboard...
    </div>
  );
}
