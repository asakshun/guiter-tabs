import { create } from 'zustand';
import { createSongSlice, SongSlice } from './slices/songSlice';
import { createCursorSlice, CursorSlice } from './slices/cursorSlice';
import { createStepSlice, StepSlice } from './slices/stepSlice';
import { createSectionSlice, SectionSlice } from './slices/sectionSlice';
import { createSongListSlice, SongListSlice } from './slices/songListSlice';

// 「グローバルな箱」へアクセスするためのカスタムフック
// 使う側は、箱のどこを見るかを引数（セレクター）で指定する
// 例: const currentSong = useTabStore((state) => state.currentSong);
// stateがセレクター。stateに箱の中身全体が入っているイメージ
export type StoreState = SongSlice & CursorSlice & StepSlice & SectionSlice & SongListSlice;

export const useTabStore = create<StoreState>()((...args) => ({
  ...createSongSlice(...args),
  ...createCursorSlice(...args),
  ...createStepSlice(...args),
  ...createSectionSlice(...args),
  ...createSongListSlice(...args),
}));
