import { useEffect, useRef } from 'react';
import { useTabStore } from '../store/tabStore';
import { Section, isSrringNumber, isTechnique } from '../types/tab';

// 各キーに対応するイベントを付与する
export function useTabKeyboard(section: Section) {
  // Cursorの状態管理はTabGrid内で完結させる
  const cursor = useTabStore((state) => state.cursor);
  const setCursor = useTabStore((state) => state.setCursor);
  const setFret = useTabStore((state) => state.setFret);
  const setTechnique = useTabStore((state) => state.setTechnique);
  // 2桁入力用の値バッファーと、バッファー保持時間のタイマー
  const inputBuffer = useRef('');
  const bufferTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 最新のCursor・Section情報を保持するためのuseRef（stale closure回避）
  const cursorRef = useRef(cursor);
  const sectionRef = useRef(section);

  useEffect(() => {
    cursorRef.current = cursor;
  }, [cursor]);

  useEffect(() => {
    sectionRef.current = section;
  }, [section]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = [
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Delete',
        'Backspace',
        'Tab',
      ];
      const isNum = /^\d$/.test(e.key);
      const isTech = ['h', 'p', 'b', 's', 'v', 'x', 't'].includes(e.key);
      if (!keys.includes(e.key) && !isNum && !isTech) return;
      e.preventDefault();

      if (e.key === 'ArrowRight' || e.key === 'Tab') {
        inputBuffer.current = '';
        setCursor({
          sectionId: cursorRef.current.sectionId,
          step: Math.min(cursorRef.current.step + 1, sectionRef.current.steps.length - 1),
          string: cursorRef.current.string,
        });
      } else if (e.key === 'ArrowLeft') {
        inputBuffer.current = '';
        setCursor({
          sectionId: cursorRef.current.sectionId,
          step: Math.max(cursorRef.current.step - 1, 0),
          string: cursorRef.current.string,
        });
      } else if (e.key === 'ArrowUp') {
        inputBuffer.current = '';
        const newString = cursorRef.current.string - 1;
        if (isSrringNumber(newString)) {
          setCursor({
            sectionId: cursorRef.current.sectionId,
            step: cursorRef.current.step,
            string: newString,
          });
        }
      } else if (e.key === 'ArrowDown') {
        inputBuffer.current = '';
        const newString = cursorRef.current.string + 1;
        if (isSrringNumber(newString)) {
          setCursor({
            sectionId: cursorRef.current.sectionId,
            step: cursorRef.current.step,
            string: newString,
          });
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        inputBuffer.current = '';
        const currentStep = sectionRef.current.steps[cursorRef.current.step];
        if (!currentStep) return;
        setFret(currentStep.id, cursorRef.current.string, null);
        setTechnique(currentStep.id, cursorRef.current.string, null);
      } else if (isNum) {
        inputBuffer.current += e.key;
        if (bufferTimer.current) clearTimeout(bufferTimer.current);
        if (parseInt(inputBuffer.current, 10) > 24) {
          inputBuffer.current = e.key;
        }
        const fret = parseInt(inputBuffer.current, 10);
        const currentStep = sectionRef.current.steps[cursorRef.current.step];
        if (!currentStep) return;
        setFret(currentStep.id, cursorRef.current.string, fret);
        bufferTimer.current = setTimeout(() => {
          inputBuffer.current = '';
          setCursor({
            sectionId: cursorRef.current.sectionId,
            step: Math.min(cursorRef.current.step + 1, sectionRef.current.steps.length - 1),
            string: cursorRef.current.string,
          });
        }, 600);
      } else if (isTech) {
        const currentStep = sectionRef.current.steps[cursorRef.current.step];
        if (!currentStep) return;
        if (isTechnique(e.key)) {
          setTechnique(currentStep.id, cursorRef.current.string, e.key);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
