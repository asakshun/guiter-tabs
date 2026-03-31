import { create } from 'zustand';
import { Song, StringNumber, Technique } from '../types/tab';
import { supabase } from '../lib/supabase';

interface Cursor {
  sectionId: string;
  step: number;
  string: StringNumber;
}

interface State {
  currentSong: Song | null;
  cursor: Cursor;
}

interface Actions {
  // ローカル初期化（Supabase なしで動作させる）
  initSong: (song: Song) => void;

  // Supabase との通信
  loadSong: (id: string) => Promise<void>;
  saveSong: () => Promise<void>;

  // カーソル操作
  setCursor: (cursor: Partial<Cursor>) => void;

  // フレット操作
  setFret: (stepId: string, stringNum: StringNumber, fret: number | null) => void;

  // テクニック操作
  setTechnique: (stepId: string, stringNum: StringNumber, technique: Technique | null) => void;

  // ステップ操作
  addStep: (sectionId: string) => void;
  removeStep: (sectionId: string, stepId: string) => void;
}

export const useTabStore = create<State & Actions>((set, get) => ({
  currentSong: null,
  cursor: { sectionId: '', step: 0, string: 5 },

  initSong: (song) => {
    set({
      currentSong: song,
      cursor: {
        sectionId: song.sections[0]?.id ?? '',
        step: 0,
        string: 5,
      },
    });
  },

  loadSong: async (id) => {
    const { data, error } = await supabase.from('songs').select('*').eq('id', id).single();
    if (error || !data) return;
    const song: Song = {
      ...data,
      sections: data.data,
    };
    set({
      currentSong: song,
      cursor: { sectionId: song.sections[0]?.id ?? '', step: 0, string: 5 },
    });
  },

  saveSong: async () => {
    const { currentSong } = get();
    if (!currentSong || currentSong.id === 'mock') return;
    await supabase.from('songs').upsert({
      id: currentSong.id,
      title: currentSong.title,
      artist: currentSong.artist,
      tuning: currentSong.tuning,
      data: currentSong.sections,
      updated_at: new Date().toISOString(),
    });
  },

  setCursor: (partial) => {
    set((state) => ({ cursor: { ...state.cursor, ...partial } }));
  },

  setFret: (stepId, stringNum, fret) => {
    set((state) => {
      if (!state.currentSong) return state;
      const sections = state.currentSong.sections.map((section) => ({
        ...section,
        steps: section.steps.map((step) =>
          step.id === stepId ? { ...step, strings: { ...step.strings, [stringNum]: fret } } : step
        ),
      }));
      return { currentSong: { ...state.currentSong, sections } };
    });
    setTimeout(() => get().saveSong(), 500);
  },

  setTechnique: (stepId, stringNum, technique) => {
    set((state) => {
      if (!state.currentSong) return state;
      const sections = state.currentSong.sections.map((section) => ({
        ...section,
        steps: section.steps.map((step) => {
          if (step.id !== stepId) return step;
          const current = step.techniques?.[stringNum];
          return {
            ...step,
            techniques: {
              ...step.techniques,
              [stringNum]: current === technique ? undefined : technique,
            },
          };
        }),
      }));
      return { currentSong: { ...state.currentSong, sections } };
    });
    setTimeout(() => get().saveSong(), 500);
  },

  addStep: (sectionId) => {
    set((state) => {
      if (!state.currentSong) return state;
      const sections = state.currentSong.sections.map((section) => {
        if (section.id !== sectionId) return section;
        const newStep = {
          id: crypto.randomUUID(),
          index: section.steps.length,
          strings: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null } as Record<StringNumber, number | null>,
        };
        return { ...section, steps: [...section.steps, newStep] };
      });
      const targetSection = sections.find((s) => s.id === sectionId);
      const newStepIndex = targetSection ? targetSection.steps.length - 1 : state.cursor.step;
      return {
        currentSong: { ...state.currentSong, sections },
        cursor: { ...state.cursor, sectionId, step: newStepIndex },
      };
    });
    setTimeout(() => get().saveSong(), 500);
  },

  removeStep: (sectionId, stepId) => {
    set((state) => {
      if (!state.currentSong) return state;
      const sections = state.currentSong.sections.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          steps: section.steps.filter((step) => step.id !== stepId),
        };
      });
      return { currentSong: { ...state.currentSong, sections } };
    });
    setTimeout(() => get().saveSong(), 500);
  },
}));
