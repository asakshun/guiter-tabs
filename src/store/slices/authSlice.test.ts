import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createStore } from 'zustand/vanilla';
import { createAuthSlice, AuthSlice } from './authSlice';

// supabase モジュールをモック
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

import { supabase } from '../../lib/supabase';

function makeStore() {
  return createStore<AuthSlice>()((...args) => ({
    ...createAuthSlice(...args),
  }));
}

const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2026-01-01T00:00:00Z',
};

const mockSession = {
  access_token: 'access-token',
  refresh_token: 'refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: mockUser,
};

describe('authSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // デフォルトで onAuthStateChange を何もしない関数にしておく
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn(), id: '', callback: vi.fn() } },
    } as ReturnType<typeof supabase.auth.onAuthStateChange>);
  });

  it('初期状態は user/session が null で isAuthInitialized が false', () => {
    const store = makeStore();
    const state = store.getState();
    expect(state.user).toBeNull();
    expect(state.session).toBeNull();
    expect(state.isAuthInitialized).toBe(false);
  });

  describe('initializeAuth', () => {
    it('セッションがある場合は user と session がセットされ isAuthInitialized が true になる', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession as unknown as typeof mockSession },
        error: null,
      } as Awaited<ReturnType<typeof supabase.auth.getSession>>);

      const store = makeStore();
      await store.getState().initializeAuth();

      expect(store.getState().user?.id).toBe('user-123');
      expect(store.getState().session?.access_token).toBe('access-token');
      expect(store.getState().isAuthInitialized).toBe(true);
    });

    it('セッションがない場合は user/session が null で isAuthInitialized が true', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      } as Awaited<ReturnType<typeof supabase.auth.getSession>>);

      const store = makeStore();
      await store.getState().initializeAuth();

      expect(store.getState().user).toBeNull();
      expect(store.getState().session).toBeNull();
      expect(store.getState().isAuthInitialized).toBe(true);
    });
  });

  describe('signIn', () => {
    it('成功時に user と session がセットされる', async () => {
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: mockUser, session: mockSession } as unknown as Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>['data'],
        error: null,
      } as Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>);

      const store = makeStore();
      await store.getState().signIn('test@example.com', 'password123');

      expect(store.getState().user?.id).toBe('user-123');
      expect(store.getState().session?.access_token).toBe('access-token');
    });

    it('失敗時はエラーをスローする', async () => {
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials', status: 400, name: 'AuthError', code: 'invalid_credentials' },
      } as unknown as Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>);

      const store = makeStore();
      await expect(store.getState().signIn('test@example.com', 'wrong')).rejects.toThrow();
    });
  });

  describe('signOut', () => {
    it('成功後に user と session が null になる', async () => {
      // まず signIn でユーザーをセット
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: mockUser, session: mockSession } as unknown as Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>['data'],
        error: null,
      } as Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>);
      vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

      const store = makeStore();
      await store.getState().signIn('test@example.com', 'password123');
      expect(store.getState().user).not.toBeNull();

      await store.getState().signOut();

      expect(store.getState().user).toBeNull();
      expect(store.getState().session).toBeNull();
    });
  });
});
