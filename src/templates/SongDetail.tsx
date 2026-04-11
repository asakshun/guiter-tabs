'use client';

import { Song } from '../types/tab';
import { Cursor } from '../store/slices/cursorSlice';
import { SongTemplate } from './Song';

type Props = {
  song: Song | null;
  cursor: Cursor;
  onSetCursor: (cursor: Partial<Cursor>) => void;
  onAddStep: (sectionId: string) => void;
  onAddSection: (label: string) => void;
  onRemoveSection: (sectionId: string) => void;
  onRenameSection: (sectionId: string, label: string) => void;
  onBack: () => void;
};

export function SongDetailTemplate({
  song,
  cursor,
  onSetCursor,
  onAddStep,
  onAddSection,
  onRemoveSection,
  onRenameSection,
  onBack,
}: Props) {
  if (!song) {
    return (
      <main className="min-h-screen bg-[#f9f9f7] p-8">
        <p className="text-sm text-[#888]">読み込み中...</p>
      </main>
    );
  }

  return (
    <div>
      <div className="bg-[#f9f9f7] px-8 pt-6 pb-0">
        <button
          onClick={onBack}
          className="text-xs text-[#888] hover:text-[#333] transition-colors"
        >
          ← 一覧へ戻る
        </button>
      </div>
      <SongTemplate
        song={song}
        cursor={cursor}
        onSetCursor={onSetCursor}
        onAddStep={onAddStep}
        onAddSection={onAddSection}
        onRemoveSection={onRemoveSection}
        onRenameSection={onRenameSection}
      />
    </div>
  );
}
