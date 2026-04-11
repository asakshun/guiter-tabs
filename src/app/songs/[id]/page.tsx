'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTabStore } from '../../../store/tabStore';
import { useTabKeyboard } from '../../../hooks/useTabKeyboard';
import { SongTemplate } from '../../../templates/Song';

export default function SongDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : '';

  const loadSong = useTabStore((state) => state.loadSong);
  const currentSong = useTabStore((state) => state.currentSong);
  const cursor = useTabStore((state) => state.cursor);
  const setCursor = useTabStore((state) => state.setCursor);
  const addStep = useTabStore((state) => state.addStep);
  const addSection = useTabStore((state) => state.addSection);
  const removeSection = useTabStore((state) => state.removeSection);
  const renameSection = useTabStore((state) => state.renameSection);

  useEffect(() => {
    if (id) loadSong(id);
  }, [id, loadSong]);

  useTabKeyboard(currentSong);

  return (
    <SongTemplate
      song={currentSong}
      cursor={cursor}
      onSetCursor={setCursor}
      onAddStep={addStep}
      onAddSection={addSection}
      onRemoveSection={removeSection}
      onRenameSection={renameSection}
      onBack={() => router.push('/songs')}
    />
  );
}
