'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTabStore } from '../../../store/tabStore';
import { AuthFormTemplate } from '../../../templates/AuthForm';

export default function SignupPage() {
  const signUp = useTabStore((state) => state.signUp);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await signUp(email, password);
      router.push('/songs');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'アカウント作成に失敗しました';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormTemplate
      mode="signup"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
    />
  );
}
