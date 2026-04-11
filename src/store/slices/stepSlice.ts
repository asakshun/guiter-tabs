import { StateCreator } from 'zustand';
import { StringNumber, Technique } from '../../types/tab';
import { updateFret, updateTechnique, appendStep, deleteStep } from '../helpers/songMutators';
import { debouncedSave } from '../helpers/persistence';
import { SongSlice } from './songSlice';
import { CursorSlice } from './cursorSlice';

export interface StepSlice {
  setFret: (stepId: string, stringNum: StringNumber, fret: number | null) => void;
  setTechnique: (stepId: string, stringNum: StringNumber, technique: Technique | null) => void;
  addStep: (sectionId: string) => void;
  removeStep: (sectionId: string, stepId: string) => void;
}

export const createStepSlice: StateCreator<SongSlice & CursorSlice & StepSlice, [], [], StepSlice> = (set, get) => ({
  setFret: (stepId, stringNum, fret) => {
    set((state) => {
      if (!state.currentSong) return state;
      return {
        currentSong: {
          ...state.currentSong,
          sections: updateFret(state.currentSong.sections, stepId, stringNum, fret),
        },
      };
    });
    debouncedSave(() => get().saveSong());
  },

  setTechnique: (stepId, stringNum, technique) => {
    set((state) => {
      if (!state.currentSong) return state;
      return {
        currentSong: {
          ...state.currentSong,
          sections: updateTechnique(state.currentSong.sections, stepId, stringNum, technique),
        },
      };
    });
    debouncedSave(() => get().saveSong());
  },

  addStep: (sectionId) => {
    set((state) => {
      if (!state.currentSong) return state;
      const sections = appendStep(state.currentSong.sections, sectionId);
      const targetSection = sections.find((s) => s.id === sectionId);
      const newStepIndex = targetSection ? targetSection.steps.length - 1 : state.cursor.step;
      return {
        currentSong: { ...state.currentSong, sections },
        cursor: { ...state.cursor, sectionId, step: newStepIndex },
      };
    });
    debouncedSave(() => get().saveSong());
  },

  removeStep: (sectionId, stepId) => {
    set((state) => {
      if (!state.currentSong) return state;
      return {
        currentSong: {
          ...state.currentSong,
          sections: deleteStep(state.currentSong.sections, sectionId, stepId),
        },
      };
    });
    debouncedSave(() => get().saveSong());
  },
});
