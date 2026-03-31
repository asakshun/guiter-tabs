'use client';

import type { Section } from '../types/tab';
import TabGrid from './TabGrid';

type Props = { section: Section };

export function SectionComponent({ section }: Props) {
  return (
    <div className="mb-7">
      <div className="inline-flex items-center text-xs font-medium bg-[#f1f0ea] border border-[#d3d1c7] rounded-md px-2.5 py-0.5 mb-2.5 text-[#5f5e5a]">
        {section.label}
      </div>
      <div className="overflow-x-auto">
        <TabGrid section={section} />
      </div>
    </div>
  );
}
