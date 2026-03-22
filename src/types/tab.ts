export type Technique = 'h' | 'p' | 'b' | 's' | 'v' | 'x' | 't';
// h=hammer-on, p=pull-off, b=bend, s=slide, v=vibrato, x=mute, t=tap

export function isTechnique(value: any): value is Technique {
  return ['h', 'p', 'b', 's', 'v', 'x', 't'].includes(value);
}

export type StringNumber = 1 | 2 | 3 | 4 | 5 | 6;

export function isSrringNumber(value: any): value is StringNumber {
  return [1, 2, 3, 4, 5, 6].includes(value);
}

export type Step = {
  id: string;
  index: number;
  strings: Record<StringNumber, number | null>;
  techniques?: Partial<Record<StringNumber, Technique>>;
};

export type Section = {
  id: string;
  index: number;
  label: string;
  steps: Step[];
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  tuning: string;
  createdAt: string;
  updatedAt: string;
  sections: Section[];
};

export type SongSummary = {
  id: string;
  title: string;
  artist: string;
  updatedAt: string;
};
