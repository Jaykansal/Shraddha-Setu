'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import TopBar from '@/components/layout/TopBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PanditLoginForm from '@/components/portal/PanditLoginForm';

export default function PanditPortalPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && user.role === 'PANDIT') {
      router.push('/dashboard/pandit');
    }
  }, [user, loading, router]);

  return (
    <div className="portal-dedicated-page pandit-page-background">
      <TopBar />
      <Navbar />
      <main className="dedicated-page-container">
        <PanditLoginForm redirectUrl="/dashboard/pandit" />
      </main>
      <Footer />
    </div>
  );
}
