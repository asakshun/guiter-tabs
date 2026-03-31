'use client';

import { useTabStore } from '../store/tabStore';
import { Section, StringNumber } from '../types/tab';

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
  const cursor = useTabStore((state) => state.cursor);
  const setCursor = useTabStore((state) => state.setCursor);
  const addStep = useTabStore((state) => state.addStep);

  return (
    <div
      className="inline-flex flex-col border-[0.5px] border-[#d3d1c7] rounded-lg overflow-hidden"
    >
      {STRING_NUMBERS.map((stringNum) => {
        const isFirstRow = stringNum === 1;
        return (
          <div
            key={stringNum}
            className="flex items-center border-b-[0.5px] border-[#e8e7e0] last:border-b-0"
          >
            {/* 弦ラベル */}
            <div className="w-7 min-w-[28px] flex items-center justify-center text-xs font-medium text-[#888] bg-[#f5f5f2] border-r-[0.5px] border-[#e0dfd8] self-stretch">
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
                      'relative w-[38px] min-w-[38px] h-9 flex items-center justify-center text-sm font-mono border-r-[0.5px] border-[#e8e7e0] last:border-r-0 cursor-pointer transition-colors duration-75',
                      fret !== null && fret !== undefined ? 'bg-[#e6f1fb]' : 'bg-white hover:bg-[#f5f5f2]',
                    ].join(' ')}
                    style={isCursor ? { outline: '2px solid #378add', outlineOffset: '-2px', zIndex: 1, borderRadius: 2 } : {}}
                    onClick={() =>
                      setCursor({ sectionId: section.id, step: step.index, string: stringNum })
                    }
                  >
                    {fret !== null && fret !== undefined ? (
                      <>
                        <span className="text-[#185fa5] font-medium text-sm">{fret}</span>
                        {technique && (
                          <span className="absolute top-0.5 right-0.5 text-[9px] text-[#185fa5] font-medium">
                            {technique}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-[#ccc] text-[10px]">·</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* + ボタン列（1弦行のみテキスト表示） */}
            <div
              className="w-[30px] min-w-[30px] h-9 flex items-center justify-center border-l-[0.5px] border-[#e0dfd8] bg-white transition-colors duration-75 cursor-pointer text-[#ccc] hover:text-[#888] hover:bg-[#f5f5f2] text-lg select-none"
              title={isFirstRow ? 'ステップを追加' : undefined}
              onClick={isFirstRow ? () => addStep(section.id) : undefined}
            >
              {isFirstRow ? '+' : ''}
            </div>
          </div>
        );
      })}
    </div>
  );
}
