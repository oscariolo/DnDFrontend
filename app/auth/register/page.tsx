'use client';

import { useAuth } from '@/app/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import RegisterForm from '@/app/components/RegisterForm';

export default function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/profile');
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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-8">D&D Campaign Manager</h1>
        <RegisterForm />
      </div>
    </main>
  );
}
