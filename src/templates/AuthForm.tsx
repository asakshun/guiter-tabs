'use client';

import { useState } from 'react';
import Link from 'next/link';

type Props = {
  mode: 'login' | 'signup';
  onSubmit: (email: string, password: string) => void;
  isLoading: boolean;
  error: string | null;
};

export function AuthFormTemplate({ mode, onSubmit, isLoading, error }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    onSubmit(email.trim(), password.trim());
  };

  const isLogin = mode === 'login';
  const title = isLogin ? 'ログイン' : 'アカウント作成';
  const submitLabel = isLogin ? 'ログイン' : 'アカウントを作成';
  const submittingLabel = isLogin ? 'ログイン中...' : '作成中...';

  return (
    <main className="min-h-screen bg-[#f9f9f7] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-medium text-[#333] mb-8 text-center">Guitar Tab Editor</h1>

        <div className="bg-white border border-[#d3d1c7] rounded-xl shadow-sm p-6">
          <h2 className="text-base font-medium text-[#333] mb-6">{title}</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-xs text-[#888]">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                autoComplete="email"
                required
                className="border border-[#d3d1c7] rounded-md px-3 py-2 text-sm text-[#333] placeholder:text-[#bbb] outline-none focus:border-[#b0ada3] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-xs text-[#888]">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6文字以上"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                minLength={6}
                className="border border-[#d3d1c7] rounded-md px-3 py-2 text-sm text-[#333] placeholder:text-[#bbb] outline-none focus:border-[#b0ada3] transition-colors"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password.trim()}
              className="mt-2 border border-[#d3d1c7] rounded-md px-4 py-2 text-sm text-[#5f5e5a] hover:border-[#b0ada3] hover:text-[#333] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? submittingLabel : submitLabel}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-[#f0ede8] text-center">
            {isLogin ? (
              <p className="text-xs text-[#888]">
                アカウントをお持ちでない方は{' '}
                <Link href="/auth/signup" className="text-[#5f5e5a] hover:text-[#333] underline transition-colors">
                  こちら
                </Link>
              </p>
            ) : (
              <p className="text-xs text-[#888]">
                すでにアカウントをお持ちの方は{' '}
                <Link href="/auth/login" className="text-[#5f5e5a] hover:text-[#333] underline transition-colors">
                  こちら
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
