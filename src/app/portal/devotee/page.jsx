'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import TopBar from '@/components/layout/TopBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DevoteeLoginForm from '@/components/portal/DevoteeLoginForm';

export default function DevoteePortalPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'PANDIT') {
        router.push('/dashboard/pandit');
      } else if (user.role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/devotee');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="portal-dedicated-page devotee-page-background">
      <TopBar />
      <Navbar />
      <main className="dedicated-page-container">
        <DevoteeLoginForm redirectUrl="/dashboard/devotee" />
      </main>
      <Footer />
    </div>
  );
}
