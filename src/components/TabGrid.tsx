'use client';

import { useTabStore } from '../store/tabStore';
import { Section, StringNumber } from '../types/tab';
import { useTabKeyboard } from '../hooks/useTabKeyboard';

// mock.html の STRING_NAMES と同じ（1弦=e, 6弦=E）
const STRING_NAMES: Record<StringNumber, string> = {
  1: 'e',
  2: 'B',
  3: 'G',
  4: 'D',
  5: 'A',
  6: 'E',
};

const STRING_NUMBERS: StringNumber[] = [1, 2, 3, 4, 5, 6];

type TabGridProps = {
  section: Section;
};

export default function TabGrid({ section }: TabGridProps) {
  // 各キーに対応するイベントを付与する
  useTabKeyboard(section);

  // Cursorの状態管理はTabGrid内で完結させる
  const cursor = useTabStore((state) => state.cursor);
  const setCursor = useTabStore((state) => state.setCursor);

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex flex-col border border-gray-200 rounded-lg">
        {STRING_NUMBERS.map((stringNum) => (
          <div
            key={stringNum}
            className="flex items-center border-b border-gray-100 last:border-b-0"
          >
            {/* 弦ラベル */}
            <div className="w-7 flex items-center justify-center text-xs font-medium text-gray-400 bg-gray-50 border-r border-gray-200 self-stretch">
              {STRING_NAMES[stringNum]}
            </div>

            {/* ステップのセル */}
            <div className="flex">
              {section.steps.map((step) => {
                const fret = step.strings[stringNum];
                const technique = step.techniques?.[stringNum];
                const isCursor =
                  cursor.sectionId === section.id &&
                  cursor.step === step.index &&
                  cursor.string === stringNum;

                return (
                  <div
                    key={step.id}
                    className={[
                      'relative w-10 h-9 flex items-center justify-center text-sm font-mono border-r border-gray-100 last:border-r-0 cursor-pointer',
                      fret !== null ? 'bg-blue-50' : 'bg-white hover:bg-gray-50',
                      isCursor ? 'outline-none z-10' : '',
                    ].join(' ')}
                    style={isCursor ? { outline: '2px solid #60a5fa', outlineOffset: '-2px' } : {}}
                    onClick={() =>
                      setCursor({ sectionId: section.id, step: step.index, string: stringNum })
                    }
                  >
                    {fret !== null ? (
                      <>
                        <span className="text-blue-700 font-medium">{fret}</span>
                        {technique && (
                          <span className="absolute top-0.5 right-0.5 text-[9px] text-blue-500 font-medium">
                            {technique}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-200 text-xs">·</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
