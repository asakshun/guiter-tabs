import TabGrid from "../components/TabGrid";
import { Section } from "../types/tab";

// mock.html のデータをそのまま使ってコンポーネントを確認する
const dummySection: Section = {
  id: "intro",
  index: 0,
  label: "イントロ",
  steps: [
    { id: "s1", index: 0, strings: { 1: null, 2: null, 3: null, 4: null, 5: 0, 6: null } },
    { id: "s2", index: 1, strings: { 1: null, 2: null, 3: null, 4: null, 5: 2, 6: null } },
    { id: "s3", index: 2, strings: { 1: null, 2: null, 3: null, 4: 2,    5: null, 6: null } },
    { id: "s4", index: 3, strings: { 1: null, 2: null, 3: null, 4: 4,    5: null, 6: null } },
    { id: "s5", index: 4, strings: { 1: null, 2: 1,    3: 0,    4: 2,    5: 3,    6: null } },
    { id: "s6", index: 5, strings: { 1: null, 2: null, 3: 2,    4: null, 5: null, 6: null }, techniques: { 3: 'h' } },
  ],
};

export default function Home() {
  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-lg font-medium mb-1">夜に駆ける</h1>
      <p className="text-sm text-gray-400 mb-6">YOASOBI · EADGBe</p>
      <p className="text-xs text-gray-400 font-mono mb-4">{dummySection.label}</p>
      <TabGrid section={dummySection} />
    </main>
  );
}
