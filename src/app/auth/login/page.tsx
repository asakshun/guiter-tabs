'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTabStore } from '../../../store/tabStore';
import { AuthFormTemplate } from '../../../templates/AuthForm';

export default function LoginPage() {
  const signIn = useTabStore((state) => state.signIn);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      router.push('/songs');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'ログインに失敗しました';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormTemplate
      mode="login"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
    />
  );
}
