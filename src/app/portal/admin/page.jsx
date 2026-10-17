'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import TopBar from '@/components/layout/TopBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AdminLoginForm from '@/components/portal/AdminLoginForm';

export default function AdminPortalPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && user.role === 'ADMIN') {
      router.push('/dashboard/admin');
    }
  }, [user, loading, router]);

  return (
    <div className="portal-dedicated-page admin-page-background">
      <TopBar />
      <Navbar />
      <main className="dedicated-page-container">
        <AdminLoginForm redirectUrl="/dashboard/admin" />
      </main>
      <Footer />
    </div>
  );
}
