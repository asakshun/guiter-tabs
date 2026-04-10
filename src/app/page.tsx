'use client';

import { useEffect } from 'react';
import { useTabStore } from '../store/tabStore';
import { SectionComponent } from '../components/Section';
import { useTabKeyboard } from '../hooks/useTabKeyboard';
import { Song, StringNumber } from '../types/tab';

const STRING_NAMES: Record<StringNumber, string> = { 1: 'e', 2: 'B', 3: 'G', 4: 'D', 5: 'A', 6: 'E' };

const mockSong: Song = {
  id: 'mock',
  title: '夜に駆ける',
  artist: 'YOASOBI',
  tuning: 'EADGBe',
  createdAt: '',
  updatedAt: '',
  sections: [
    {
      id: 'intro',
      index: 0,
      label: 'イントロ',
      steps: [
        { id: 's1', index: 0, strings: { 1: null, 2: null, 3: null, 4: null, 5: 0, 6: null } },
        { id: 's2', index: 1, strings: { 1: null, 2: null, 3: null, 4: null, 5: 2, 6: null } },
        { id: 's3', index: 2, strings: { 1: null, 2: null, 3: null, 4: 2, 5: null, 6: null } },
        { id: 's4', index: 3, strings: { 1: null, 2: null, 3: null, 4: 4, 5: null, 6: null } },
        { id: 's5', index: 4, strings: { 1: null, 2: null, 3: null, 4: null, 5: 0, 6: null } },
        { id: 's6', index: 5, strings: { 1: null, 2: 1, 3: 0, 4: 2, 5: 3, 6: null } },
        { id: 's7', index: 6, strings: { 1: 0, 2: 1, 3: 0, 4: 2, 5: 3, 6: null } },
        { id: 's8', index: 7, strings: { 1: null, 2: null, 3: 2, 4: null, 5: null, 6: null }, techniques: { 3: 'h' } },
      ],
    },
    {
      id: 'sabi',
      index: 1,
      label: 'サビ',
      steps: [
        { id: 'sb1', index: 0, strings: { 1: 0, 2: 1, 3: 0, 4: 2, 5: 3, 6: null } },
        { id: 'sb2', index: 1, strings: { 1: null, 2: 3, 3: 2, 4: null, 5: null, 6: null } },
        { id: 'sb3', index: 2, strings: { 1: null, 2: null, 3: null, 4: 5, 5: 5, 6: null } },
        { id: 'sb4', index: 3, strings: { 1: null, 2: null, 3: 4, 4: 5, 5: null, 6: null } },
        { id: 'sb5', index: 4, strings: { 1: null, 2: null, 3: null, 4: null, 5: 3, 6: 3 } },
        { id: 'sb6', index: 5, strings: { 1: null, 2: null, 3: null, 4: 2, 5: null, 6: null } },
      ],
    },
  ],
};

export default function Home() {
  const initSong = useTabStore((state) => state.initSong);
  const currentSong = useTabStore((state) => state.currentSong);
  const cursor = useTabStore((state) => state.cursor);
  const addSection = useTabStore((state) => state.addSection);

  useEffect(() => {
    initSong(mockSong);
  }, []);

  useTabKeyboard(currentSong);

  const cursorInfo = (() => {
    if (!currentSong) return 'クリックまたは矢印キーで操作';
    const section = currentSong.sections.find((s) => s.id === cursor.sectionId);
    if (!section) return 'クリックまたは矢印キーで操作';
    const step = section.steps[cursor.step];
    if (!step) return 'クリックまたは矢印キーで操作';
    const fret = step.strings[cursor.string];
    const fretStr = fret !== null && fret !== undefined ? `フレット ${fret}` : '(空)';
    return `${section.label} · ステップ ${cursor.step + 1} · ${cursor.string}弦 (${STRING_NAMES[cursor.string]}) · ${fretStr}`;
  })();

  return (
    <main className="p-8 bg-[#f9f9f7] min-h-screen">
      <h1 className="text-xl font-medium mb-1">{currentSong?.title ?? '夜に駆ける'}</h1>
      <p className="text-sm text-[#888] mb-6">
        {currentSong ? `${currentSong.artist} · ${currentSong.tuning} · チューニング標準` : 'YOASOBI · EADGBe · チューニング標準'}
      </p>
      <p className="text-xs text-[#aaa] font-mono mb-4 min-h-[18px]">{cursorInfo}</p>

      <div>
        {(currentSong ?? mockSong).sections.map((section) => (
          <SectionComponent
            key={section.id}
            section={section}
            totalSections={(currentSong ?? mockSong).sections.length}
          />
        ))}
      </div>

      <button
        onClick={() => addSection('新しいセクション')}
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
