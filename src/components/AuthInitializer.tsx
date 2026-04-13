'use client';

import { useEffect } from 'react';
import { useTabStore } from '../store/tabStore';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const isAuthInitialized = useTabStore((state) => state.isAuthInitialized);
  const initializeAuth = useTabStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (!isAuthInitialized) {
    return (
      <div className="min-h-screen bg-[#f9f9f7] flex items-center justify-center">
        <p className="text-sm text-[#888]">読み込み中...</p>
      </div>
    );
  }

  return <>{children}</>;
}
