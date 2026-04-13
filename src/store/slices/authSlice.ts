import { StateCreator } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

export interface AuthSlice {
  user: User | null;
  session: Session | null;
  isAuthInitialized: boolean;
  initializeAuth: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  user: null,
  session: null,
  isAuthInitialized: false,

  initializeAuth: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({
      session,
      user: session?.user ?? null,
      isAuthInitialized: true,
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ?? null,
      });
    });
  },

  signUp: async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('サインアップエラー:', error.message);
      throw error;
    }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('サインインエラー:', error.message);
      throw error;
    }
    set({
      session: data.session,
      user: data.user,
    });
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('サインアウトエラー:', error.message);
      return;
    }
    set({ user: null, session: null });
  },
});
