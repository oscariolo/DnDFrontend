'use client';

import { useAuth } from '@/app/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoginForm from '@/app/components/LoginForm';

export default function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      let returnTo: string | null = null;
      try {
        if (typeof window !== 'undefined') {
          const sp = new URLSearchParams(window.location.search);
          returnTo = sp.get('returnTo');
        }
      } catch (e) {
        returnTo = null;
      }
      router.push(returnTo || '/profile');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 to-gray-800 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">D&D Campaign Manager</h1>
        <LoginForm />
      </div>
    </main>
  );
}