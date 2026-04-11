'use client';

import { useRouter } from 'next/navigation';
import { SongSummary } from '../types/tab';

type Props = {
  song: SongSummary;
  onDelete: (id: string) => void;
};

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function SongCard({ song, onDelete }: Props) {
  const router = useRouter();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (song.id === 'mock') return;
    if (window.confirm(`「${song.title}」を削除しますか？この操作は取り消せません。`)) {
      onDelete(song.id);
    }
  };

  return (
    <div
      onClick={() => router.push(`/songs/${song.id}`)}
      className="group relative cursor-pointer bg-white border border-[#d3d1c7] rounded-lg px-5 py-4 hover:border-[#b0ada3] transition-colors"
    >
      <p className="text-sm font-medium text-[#333] truncate pr-8">{song.title || '(無題)'}</p>
      <p className="text-xs text-[#888] mt-1">
        {song.artist ? `${song.artist} · ` : ''}
        {formatDate(song.updatedAt)}
      </p>

      {song.id !== 'mock' && (
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#bbb] hover:text-red-400 text-xs px-1.5 py-0.5 rounded"
          aria-label="削除"
        >
          削除
        </button>
      )}
    </div>
  );
}
