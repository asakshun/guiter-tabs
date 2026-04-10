'use client';

import { useState, useRef, useEffect } from 'react';
import type { Section } from '../types/tab';
import TabGrid from './TabGrid';
import { useTabStore } from '../store/tabStore';

type Props = { section: Section; totalSections: number };

export function SectionComponent({ section, totalSections }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftLabel, setDraftLabel] = useState(section.label);
  const inputRef = useRef<HTMLInputElement>(null);
  const renameSection = useTabStore((state) => state.renameSection);
  const removeSection = useTabStore((state) => state.removeSection);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleConfirm = () => {
    const trimmed = draftLabel.trim();
    if (trimmed) {
      renameSection(section.id, trimmed);
    } else {
      setDraftLabel(section.label);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      setDraftLabel(section.label);
      setIsEditing(false);
    }
  };

  return (
    <div className="mb-7">
      <div className="flex items-center gap-1.5 mb-2.5">
        {isEditing ? (
          <input
            ref={inputRef}
            value={draftLabel}
            onChange={(e) => setDraftLabel(e.target.value)}
            onBlur={handleConfirm}
            onKeyDown={handleKeyDown}
            className="text-xs font-medium bg-white border border-[#a8a6a0] rounded-md px-2.5 py-0.5 text-[#5f5e5a] outline-none focus:ring-1 focus:ring-[#888]"
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center text-xs font-medium bg-[#f1f0ea] border border-[#d3d1c7] rounded-md px-2.5 py-0.5 text-[#5f5e5a] hover:bg-[#e8e7e1] transition-colors cursor-text"
          >
            {section.label}
          </button>
        )}
        <button
          onClick={() => removeSection(section.id)}
          disabled={totalSections <= 1}
          title="セクションを削除"
          className="text-[#bbb] hover:text-[#e55] transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs leading-none px-1"
        >
          ×
        </button>
      </div>
      <div className="overflow-x-auto">
        <TabGrid section={section} />
      </div>
    </div>
  );
}
