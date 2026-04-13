'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTabStore } from '../../store/tabStore';
import { SongListTemplate } from '../../templates/SongList';

export default function SongsPage() {
  const songs = useTabStore((state) => state.songs);
  const isLoadingSongList = useTabStore((state) => state.isLoadingSongList);
  const fetchSongList = useTabStore((state) => state.fetchSongList);
  const createNewSong = useTabStore((state) => state.createNewSong);
  const deleteSong = useTabStore((state) => state.deleteSong);
  const user = useTabStore((state) => state.user);
  const signOut = useTabStore((state) => state.signOut);
  const router = useRouter();

  useEffect(() => {
    fetchSongList();
  }, [fetchSongList]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/login');
  };

  return (
    <SongListTemplate
      songs={songs}
      isLoading={isLoadingSongList}
      onCreateSong={createNewSong}
      onDeleteSong={deleteSong}
      userEmail={user?.email ?? null}
      onSignOut={handleSignOut}
    />
  );
}
