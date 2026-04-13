'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SongSummary } from '../types/tab';
import { SongCard } from '../components/SongCard';

type Props = {
  songs: SongSummary[];
  isLoading: boolean;
  onCreateSong: (title: string) => Promise<string>;
  onDeleteSong: (id: string) => void;
  userEmail: string | null;
  onSignOut: () => void;
};

export function SongListTemplate({ songs, isLoading, onCreateSong, onDeleteSong, userEmail, onSignOut }: Props) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setIsCreating(true);
    const id = await onCreateSong(newTitle.trim());
    setIsCreating(false);
    setIsModalOpen(false);
    setNewTitle('');
    router.push(`/songs/${id}`);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setNewTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreate();
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <main className="min-h-screen bg-[#f9f9f7] p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-medium text-[#333]">マイタブ譜</h1>
          <div className="flex items-center gap-3">
            {userEmail && (
              <span className="text-xs text-[#888] hidden sm:block">{userEmail}</span>
            )}
            <button
              onClick={onSignOut}
              className="text-sm text-[#888] hover:text-[#333] transition-colors"
            >
              ログアウト
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm border border-[#d3d1c7] rounded-md px-4 py-2 text-[#5f5e5a] hover:border-[#b0ada3] hover:text-[#333] transition-colors"
            >
              + 新規作成
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-[#888]">読み込み中...</p>
        ) : songs.length === 0 ? (
          <p className="text-sm text-[#888]">まだ曲がありません。新規作成してみましょう。</p>
        ) : (
          <div className="flex flex-col gap-3">
            {songs.map((song) => (
              <SongCard key={song.id} song={song} onDelete={onDeleteSong} />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white border border-[#d3d1c7] rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">
            <h2 className="text-base font-medium text-[#333] mb-4">新しい曲を作成</h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="曲名を入力"
              autoFocus
              className="w-full border border-[#d3d1c7] rounded-md px-3 py-2 text-sm text-[#333] placeholder:text-[#bbb] outline-none focus:border-[#b0ada3] transition-colors"
            />
            <div className="flex gap-2 mt-4 justify-end">
              <button
                onClick={handleCancel}
                className="text-sm px-4 py-2 text-[#888] hover:text-[#333] transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleCreate}
                disabled={!newTitle.trim() || isCreating}
                className="text-sm border border-[#d3d1c7] rounded-md px-4 py-2 text-[#5f5e5a] hover:border-[#b0ada3] hover:text-[#333] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isCreating ? '作成中...' : '作成'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
