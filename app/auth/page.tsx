'use client';

import { useAuth } from '@/app/lib/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import LoginForm from '@/app/components/LoginForm';

export default function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const returnTo = searchParams?.get('returnTo');
      router.push(returnTo || '/profile');
    }
  }, [isLoading, isAuthenticated, router, searchParams]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">D&D Campaign Manager</h1>
        <LoginForm />
      </div>
    </main>
  );
}
