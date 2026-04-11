'use client';

import { Song, StringNumber } from '../types/tab';
import { Cursor } from '../store/slices/cursorSlice';
import { SectionComponent } from '../components/Section';

const STRING_NAMES: Record<StringNumber, string> = { 1: 'e', 2: 'B', 3: 'G', 4: 'D', 5: 'A', 6: 'E' };

type Props = {
  song: Song | null;
  cursor: Cursor;
  onSetCursor: (cursor: Partial<Cursor>) => void;
  onAddStep: (sectionId: string) => void;
  onAddSection: (label: string) => void;
  onRemoveSection: (sectionId: string) => void;
  onRenameSection: (sectionId: string, label: string) => void;
  onBack?: () => void;
};

export function SongTemplate({
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
  const cursorInfo = (() => {
    const section = song.sections.find((s) => s.id === cursor.sectionId);
    if (!section) return 'クリックまたは矢印キーで操作';
    const step = section.steps[cursor.step];
    if (!step) return 'クリックまたは矢印キーで操作';
    const fret = step.strings[cursor.string];
    const fretStr = fret !== null && fret !== undefined ? `フレット ${fret}` : '(空)';
    return `${section.label} · ステップ ${cursor.step + 1} · ${cursor.string}弦 (${STRING_NAMES[cursor.string]}) · ${fretStr}`;
  })();

  return (
    <main className="p-8 bg-[#f9f9f7] min-h-screen">
      {onBack && (
        <button
          onClick={onBack}
          className="text-xs text-[#888] hover:text-[#333] transition-colors mb-6 block"
        >
          ← 一覧へ戻る
        </button>
      )}
      <h1 className="text-xl font-medium mb-1">{song.title}</h1>
      <p className="text-sm text-[#888] mb-6">
        {song.artist} · {song.tuning} · チューニング標準
      </p>
      <p className="text-xs text-[#aaa] font-mono mb-4 min-h-[18px]">{cursorInfo}</p>

      <div>
        {song.sections.map((section) => (
          <SectionComponent
            key={section.id}
            section={section}
            totalSections={song.sections.length}
            cursor={cursor}
            onSetCursor={onSetCursor}
            onAddStep={onAddStep}
            onRename={onRenameSection}
            onRemove={onRemoveSection}
          />
        ))}
      </div>

      <button
        onClick={() => onAddSection('新しいセクション')}
        className="mt-2 mb-6 text-xs text-[#888] hover:text-[#333] border border-dashed border-[#d3d1c7] rounded-md px-3 py-1.5 transition-colors"
      >
        + セクションを追加
      </button>

      <h2 className="text-xs font-medium text-[#aaa] uppercase tracking-widest mt-7 mb-3">キーボード操作</h2>
      <div className="grid gap-y-1.5 gap-x-3.5 text-xs text-[#888]" style={{ gridTemplateColumns: 'auto 1fr', maxWidth: 480 }}>
        <span className="font-mono bg-[#f1f0ea] border border-[#d3d1c7] rounded px-1.5 py-0.5 text-[11px] text-[#333] whitespace-nowrap">← →</span>
        <span className="flex items-center">ステップ移動</span>
        <span className="font-mono bg-[#f1f0ea] border border-[#d3d1c7] rounded px-1.5 py-0.5 text-[11px] text-[#333] whitespace-nowrap">↑ ↓</span>
        <span className="flex items-center">弦移動（1弦〜6弦）</span>
        <span className="font-mono bg-[#f1f0ea] border border-[#d3d1c7] rounded px-1.5 py-0.5 text-[11px] text-[#333] whitespace-nowrap">0〜9</span>
        <span className="flex items-center">フレット番号入力（2桁対応: 12など）</span>
        <span className="font-mono bg-[#f1f0ea] border border-[#d3d1c7] rounded px-1.5 py-0.5 text-[11px] text-[#333] whitespace-nowrap">Del</span>
        <span className="flex items-center">フレットをクリア</span>
        <span className="font-mono bg-[#f1f0ea] border border-[#d3d1c7] rounded px-1.5 py-0.5 text-[11px] text-[#333] whitespace-nowrap">Tab</span>
        <span className="flex items-center">次のステップへ</span>
        <span className="font-mono bg-[#f1f0ea] border border-[#d3d1c7] rounded px-1.5 py-0.5 text-[11px] text-[#333] whitespace-nowrap">h p b s v</span>
        <span className="flex items-center">テクニック（hammer / pull / bend / slide / vibrato）トグル</span>
      </div>
    </main>
  );
}
