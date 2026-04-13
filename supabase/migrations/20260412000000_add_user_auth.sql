-- songs テーブルに user_id カラムを追加
ALTER TABLE songs ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- RLS を有効化
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- ポリシーを作成
CREATE POLICY "Users can view own songs" ON songs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own songs" ON songs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own songs" ON songs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own songs" ON songs
  FOR DELETE USING (auth.uid() = user_id);
