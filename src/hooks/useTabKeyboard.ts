import { useEffect, useRef } from 'react';
import { useTabStore } from '../store/tabStore';
import { Song, isSrringNumber, isTechnique } from '../types/tab';

// Song レベルで一度だけ呼び出す（複数セクションで重複リスナーにならないように）
export function useTabKeyboard(song: Song | null) {
  const cursor = useTabStore((state) => state.cursor);
  const setCursor = useTabStore((state) => state.setCursor);
  const setFret = useTabStore((state) => state.setFret);
  const setTechnique = useTabStore((state) => state.setTechnique);

  // 2桁入力用バッファー
  const inputBuffer = useRef('');
  const bufferTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // stale closure 回避用 ref
  const cursorRef = useRef(cursor);
  const songRef = useRef(song);

  useEffect(() => { cursorRef.current = cursor; }, [cursor]);
  useEffect(() => { songRef.current = song; }, [song]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete', 'Backspace', 'Tab'];
      const isNum = /^\d$/.test(e.key);
      const isTech = ['h', 'p', 'b', 's', 'v', 'x', 't'].includes(e.key);
      if (!keys.includes(e.key) && !isNum && !isTech) return;
      e.preventDefault();

      const currentSong = songRef.current;
      if (!currentSong) return;

      const cur = cursorRef.current;
      const currentSection = currentSong.sections.find((s) => s.id === cur.sectionId);
      if (!currentSection) return;

      if (e.key === 'ArrowRight' || e.key === 'Tab') {
        inputBuffer.current = '';
        setCursor({ step: Math.min(cur.step + 1, currentSection.steps.length - 1) });
      } else if (e.key === 'ArrowLeft') {
        inputBuffer.current = '';
        setCursor({ step: Math.max(cur.step - 1, 0) });
      } else if (e.key === 'ArrowUp') {
        inputBuffer.current = '';
        const newString = cur.string - 1;
        if (isSrringNumber(newString)) setCursor({ string: newString });
      } else if (e.key === 'ArrowDown') {
        inputBuffer.current = '';
        const newString = cur.string + 1;
        if (isSrringNumber(newString)) setCursor({ string: newString });
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        inputBuffer.current = '';
        const currentStep = currentSection.steps[cur.step];
        if (!currentStep) return;
        setFret(currentStep.id, cur.string, null);
        setTechnique(currentStep.id, cur.string, null);
      } else if (isNum) {
        inputBuffer.current += e.key;
        if (bufferTimer.current) clearTimeout(bufferTimer.current);
        if (parseInt(inputBuffer.current, 10) > 24) {
          inputBuffer.current = e.key;
        }
        const fret = parseInt(inputBuffer.current, 10);
        const currentStep = currentSection.steps[cur.step];
        if (!currentStep) return;
        setFret(currentStep.id, cur.string, fret);
        bufferTimer.current = setTimeout(() => {
          inputBuffer.current = '';
          setCursor({ step: Math.min(cursorRef.current.step + 1, currentSection.steps.length - 1) });
        }, 600);
      } else if (isTech) {
        const currentStep = currentSection.steps[cur.step];
        if (!currentStep) return;
        if (isTechnique(e.key)) {
          setTechnique(currentStep.id, cur.string, e.key);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}
