'use client';

import { useEffect } from 'react';
import { useTabStore } from '../../store/tabStore';
import { useTabKeyboard } from '../../hooks/useTabKeyboard';
import { SongTemplate } from '../../templates/Song';
import { Song } from '../../types/tab';

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
        {
          id: 's8',
          index: 7,
          strings: { 1: null, 2: null, 3: 2, 4: null, 5: null, 6: null },
          techniques: { 3: 'h' },
        },
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

export default function SongPage() {
  const initSong = useTabStore((state) => state.initSong);
  const currentSong = useTabStore((state) => state.currentSong);
  const cursor = useTabStore((state) => state.cursor);
  const setCursor = useTabStore((state) => state.setCursor);
  const addStep = useTabStore((state) => state.addStep);
  const addSection = useTabStore((state) => state.addSection);
  const removeSection = useTabStore((state) => state.removeSection);
  const renameSection = useTabStore((state) => state.renameSection);

  useEffect(() => {
    initSong(mockSong);
  }, []);

  useTabKeyboard(currentSong);

  if (!currentSong) return null;

  return (
    <SongTemplate
      song={currentSong}
      cursor={cursor}
      onSetCursor={setCursor}
      onAddStep={addStep}
      onAddSection={addSection}
      onRemoveSection={removeSection}
      onRenameSection={renameSection}
    />
  );
}
