import { Section, Step, StringNumber, Technique } from '../../types/tab';

/**
 * 空のステップを1つ生成する
 */
export function createEmptyStep(index: number): Step {
  return {
    id: crypto.randomUUID(),
    index,
    strings: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null },
  };
}

/**
 * 指定ステップのフレットを更新した sections を返す
 */
export function updateFret(
  sections: Section[],
  stepId: string,
  stringNum: StringNumber,
  fret: number | null
): Section[] {
  return sections.map((section) => ({
    ...section,
    steps: section.steps.map((step) =>
      step.id === stepId
        ? { ...step, strings: { ...step.strings, [stringNum]: fret } }
        : step
    ),
  }));
}

/**
 * 指定ステップのテクニックを更新した sections を返す（同じテクニックなら解除）
 */
export function updateTechnique(
  sections: Section[],
  stepId: string,
  stringNum: StringNumber,
  technique: Technique | null
): Section[] {
  return sections.map((section) => ({
    ...section,
    steps: section.steps.map((step) => {
      if (step.id !== stepId) return step;
      const current = step.techniques?.[stringNum];
      return {
        ...step,
        techniques: {
          ...step.techniques,
          [stringNum]: current === technique ? undefined : technique ?? undefined,
        },
      };
    }),
  }));
}

/**
 * 指定セクションに新しいステップを追加した sections を返す
 */
export function appendStep(sections: Section[], sectionId: string): Section[] {
  return sections.map((section) => {
    if (section.id !== sectionId) return section;
    return {
      ...section,
      steps: [...section.steps, createEmptyStep(section.steps.length)],
    };
  });
}

/**
 * 指定ステップを削除した sections を返す
 */
export function deleteStep(sections: Section[], sectionId: string, stepId: string): Section[] {
  return sections.map((section) => {
    if (section.id !== sectionId) return section;
    return {
      ...section,
      steps: section.steps.filter((step) => step.id !== stepId),
    };
  });
}

/**
 * 新しいセクションを末尾に追加した sections を返す
 */
export function appendSection(
  sections: Section[],
  label: string
): { sections: Section[]; newSectionId: string } {
  const newSection: Section = {
    id: crypto.randomUUID(),
    index: sections.length,
    label,
    steps: [createEmptyStep(0)],
  };
  return { sections: [...sections, newSection], newSectionId: newSection.id };
}

/**
 * 指定セクションを削除し index を振り直した sections を返す
 */
export function deleteSection(sections: Section[], sectionId: string): Section[] {
  return sections
    .filter((s) => s.id !== sectionId)
    .map((s, i) => ({ ...s, index: i }));
}
