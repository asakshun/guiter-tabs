### JSONサンプル

```json
{
  "id": "song_abc123",
  "title": "夜に駆ける",
  "artist": "YOASOBI",
  "tuning": "EADGBe",
  "createdAt": "2026-03-16T00:00:00Z",
  "updatedAt": "2026-03-16T00:00:00Z",
  "sections": [
    {
      "id": "sec_001",
      "index": 0,
      "label": "イントロ",
      "steps": [
        {
          "id": "step_001",
          "index": 0,
          "strings": { "1": null, "2": null, "3": null, "4": null, "5": 0, "6": null }
        },
        {
          "id": "step_002",
          "index": 1,
          "strings": { "1": null, "2": null, "3": 2, "4": null, "5": null, "6": null },
          "techniques": { "3": "h" }
        }
      ]
    }
  ]
}
```

---

## データ保存戦略

### 構成

```
Zustand（メモリ上）
  ↕ 読み書き（即時）
Supabase / Postgres（クラウド永続化）
  ↕ upsert（500ms debounce）
Vercel（ホスティング）
```

### Supabase テーブル設計

```sql
CREATE TABLE songs (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  title TEXT,
  artist TEXT,
  tuning TEXT,
  data JSONB,  -- sections[] ごとまるごと格納
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

`sections` 以下の構造（Section / Step）は `data` カラムに JSONB でまるごと入れる。TypeScript の型定義を変えなくて済む。

### Zustand の役割

- 今開いている曲のデータをメモリ上に保持（即時描画用）
- フレット入力のたびに state を更新 → 画面に即反映
- 500ms debounce 後に Supabase へ upsert

### 曲一覧の取得

```ts
// 一覧は軽量に（data カラムは取得しない）
supabase.from('songs').select('id, title, artist, updated_at');

// 曲を開くときだけ全データ取得
supabase.from('songs').select('*').eq('id', songId).single();
```

---

## UIの仕様

### グリッド表示

- 6弦 × n ステップ のグリッド
- 弦ラベルは上から 1弦（e）→ 6弦（E）
- フレット番号が入っているセルはハイライト表示
- 鳴らさない弦は「·」（ドット）で表示
- テクニックは右上に小さなバッジで表示（例: `h`）

### キーボード操作

| キー                | 動作                                         |
| ------------------- | -------------------------------------------- |
| `←` `→`             | ステップ移動（左右）                         |
| `↑` `↓`             | 弦移動（上下、1弦〜6弦）                     |
| `0`〜`9`            | フレット番号入力（2桁対応: 600ms待って確定） |
| `Del` / `Backspace` | カーソルのフレットをクリア                   |
| `Tab`               | 次のステップへ進む                           |
| `h`                 | hammer-on トグル                             |
| `p`                 | pull-off トグル                              |
| `b`                 | bend トグル                                  |
| `s`                 | slide トグル                                 |
| `v`                 | vibrato トグル                               |

### 2桁フレット入力のロジック

```
数字キーを押す
  → バッファに追加
  → 即座にプレビュー表示（仮確定）
  → 600ms以内にもう1桁押したら2桁として確定
  → 600ms経過したら1桁で確定 → 次のステップへ自動移動
```

### セクション

- 任意のラベル（自由入力）
- セクション単位で追加・削除・並び替え
- セクションをまたいだカーソル移動は現時点では未実装（MVP外）

---

## 実装順序

1. **プロジェクトセットアップ** → Tailwind + Zustand + Supabase クライアント追加
2. **型定義** → `types/tab.ts` に Song / Section / Step / Technique を定義
3. **Supabase セットアップ** → テーブル作成・環境変数設定（`.env.local`）
4. **Zustand store** → `store/tabStore.ts`、Supabase との読み書きロジック付き
5. **TabGrid コンポーネント** → グリッド描画 + キーボード入力ロジック
6. **Section コンポーネント** → セクションラベル + TabGrid のラッパー
7. **Song ページ** → セクション一覧、曲タイトル表示
8. **曲一覧ページ** → 新規作成・既存曲を開く
9. **Vercel デプロイ** → 環境変数を Vercel に設定、Supabase と接続確認

---

## 参考: モックについて

`public/mock.html` を参照。ブラウザで直接開くと動作確認できる。  
TabGridコンポーネントの実装は、このモックのJSロジックをそのままReact + TypeScriptに移植する形で進める。
