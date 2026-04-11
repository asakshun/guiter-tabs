'use client';

import { useEffect } from 'react';
import { useTabStore } from '../../store/tabStore';
import { SongListTemplate } from '../../templates/SongList';

export default function SongsPage() {
  const songs = useTabStore((state) => state.songs);
  const isLoadingSongList = useTabStore((state) => state.isLoadingSongList);
  const fetchSongList = useTabStore((state) => state.fetchSongList);
  const createNewSong = useTabStore((state) => state.createNewSong);
  const deleteSong = useTabStore((state) => state.deleteSong);

  useEffect(() => {
    fetchSongList();
  }, [fetchSongList]);

  return (
    <SongListTemplate
      songs={songs}
      isLoading={isLoadingSongList}
      onCreateSong={createNewSong}
      onDeleteSong={deleteSong}
    />
  );
}
