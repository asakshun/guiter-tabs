# Guitar Tab Editor — プロジェクトコンテキスト

## プロジェクト概要

ギターのタブ譜を記録するWebアプリ。個人利用・MVP。  
楽譜の知識がなくても使えるシンプルさを最優先にしている。
収益化を前提としている。

---

## 技術スタック

| 項目           | 採用技術                                           |
| -------------- | -------------------------------------------------- |
| フレームワーク | Next.js (App Router)                               |
| スタイリング   | Tailwind CSS                                       |
| 状態管理       | Zustand                                            |
| タブ譜描画     | HTMLグリッド自前描画（VexFlowは使わない）          |
| データ保存     | Supabase（Postgres） + Zustand（メモリキャッシュ） |
| ホスティング   | Vercel                                             |
| パッケージ管理 | pnpm                                               |
| 言語           | TypeScript                                         |

**VexFlowを使わない理由**: VexFlowは音価（音符の長さ）が前提の設計。このアプリは音価不要なので、シンプルにHTMLグリッドで自前描画した方が実装もっとシンプルになる。

---

## 設計方針

- **音価（音符の長さ）は持たない** → どこを弾くかだけを記録する
- **小節の概念を捨てる** → 代わりに「セクション」という任意の塊で区切る
- セクションは「イントロ」「サビ」「Aメロ」などなど人間が意味で命名
- 楽譜に親しんでいない人でも読める・使えることが重要

---

## ターゲット・競合・ポジショニング

### ターゲット
- 中級以上のギタリスト（耳コピをする層）
- 日本の推定人口：数十万人規模

### 競合との差別化

| ツール          | 耳コピ中のメモとして使うと         |
| --------------- | ---------------------------------- |
| Guitar Pro      | 起動が重い、設定が多すぎる         |
| Ultimate Guitar | 閲覧専用、編集できない             |
| メモ帳・紙      | 書けるが後で読み返せない           |
| このアプリ      | **耳コピ中の素早いメモに特化**     |

**音価省略が正解な理由**：耳コピ中はリズムより音程の方が先にわかることが多い。「何弦何フレット」が先で、拍は後から体で覚える。だから音価不要はこのユーザーにとってメリット。

### 刺さる追加機能
- **参照音源リンクの添付**（YouTubeリンクなど）→ タブ譜 + 音源をセットで保存 → 見返したとき音源と照合できる → 再現性の問題がほぼ解決

---

## 収益化戦略

### 最短ルート
1. Vercelでとにかく公開する
2. Twitter（X）のギター垢・耳コピ勢に紹介（「耳コピしたフレーズをすぐメモれるアプリ作った」）
3. 無料で使ってもらってフィードバック収集
4. 保存上限・共有機能を有料化

### コンテンツ戦略
- Noteアカウントで「耳コピ勢エンジニアが作ったツール」という文脈で記事を書く
- 作者が当事者（ギタリスト×エンジニア）というのは最強の説得力

### 目標
- 月200人の有料ユーザー獲得が現実的ライン

---

## データモデル

### 階層構造

```
Song
  └── Section（任意の塊: "イントロ", "サビ" など）
        └── Step（1タイミング = ピックを1回振る瞬間）
              └── strings: { 1: fret | null, 2: fret | null, ... 6: fret | null }
```

---

## Store 設計ルール（`src/store/` 改修時に必ず読むこと）

### ファイル構成

```
src/store/
├── tabStore.ts          ← create() で4スライスを束ねるだけ。ロジックを書かない
├── slices/
│   ├── songSlice.ts     ← currentSong / initSong / loadSong / saveSong
│   ├── cursorSlice.ts   ← cursor / setCursor
│   ├── stepSlice.ts     ← setFret / setTechnique / addStep / removeStep
│   └── sectionSlice.ts  ← addSection / removeSection / renameSection
└── helpers/
    ├── songMutators.ts  ← sections.map() など副作用のない純粋関数
    └── persistence.ts   ← Supabase通信 / debouncedSave
```

### 追加・変更のルール

| やりたいこと | 場所 |
| --- | --- |
| 新しいアクションを追加する | 責務に対応するスライスに追加 |
| 新しい状態の塊を追加する（例: 認証・UI状態） | 新スライスを作り `tabStore.ts` で束ねる |
| `sections.map()` のロジック | `helpers/songMutators.ts` に純粋関数として切り出す |
| Supabase 操作を変更・追加する | `helpers/persistence.ts` を編集 |
| `tabStore.ts` 本体 | スライスの import と spread のみ。ロジックを直接書かない |

### debouncedSave の使い方

各アクションの末尾で直接 `setTimeout` を書かず、必ず `debouncedSave` を使う：

```ts
// NG
setTimeout(() => get().saveSong(), 500);

// OK
import { debouncedSave } from '../helpers/persistence';
debouncedSave(() => get().saveSong());
```

### スライス間の依存関係

`stepSlice` と `sectionSlice` は `SongSlice & CursorSlice` に依存している。  
新しいスライスが他のスライスの状態を参照する場合は、`StateCreator` のジェネリクスに依存先のスライス型を追加する。
