-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can only have one of each badge type
  UNIQUE(user_id, badge_type)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS badges_user_id_idx ON badges(user_id);
CREATE INDEX IF NOT EXISTS badges_badge_type_idx ON badges(badge_type);

-- Create function to award chat participation badge
CREATE OR REPLACE FUNCTION award_chat_participation_badge()
RETURNS TRIGGER AS $$
BEGIN
  -- If participation count is increased to 1 or more
  IF NEW.participationcount > 0 AND (OLD.participationcount IS NULL OR OLD.participationcount = 0) THEN
    -- Award chat-participation badge if not already awarded
    INSERT INTO badges (user_id, badge_type)
    VALUES (NEW.id, 'chat-participation')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
    
    -- Award first-response badge if not already awarded
    INSERT INTO badges (user_id, badge_type)
    VALUES (NEW.id, 'first-response')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  END IF;
  
  -- If participation count reaches 10, award frequent-user badge
  IF NEW.participationcount >= 10 AND (OLD.participationcount IS NULL OR OLD.participationcount < 10) THEN
    INSERT INTO badges (user_id, badge_type)
    VALUES (NEW.id, 'frequent-user')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  END IF;
  
  -- If user has applied, award application-started badge
  IF NEW.hasapplied = true AND (OLD.hasapplied IS NULL OR OLD.hasapplied = false) THEN
    INSERT INTO badges (user_id, badge_type)
    VALUES (NEW.id, 'application-started')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to award badges when user is updated
CREATE TRIGGER award_badges_on_user_update
AFTER UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION award_chat_participation_badge();

-- Create function to award badges for test completions
CREATE OR REPLACE FUNCTION award_test_completion_badge(
  p_user_id UUID,
  p_test_type TEXT
)
RETURNS VOID AS $$
DECLARE
  badge_type TEXT;
BEGIN
  -- Map test type to badge type
  CASE p_test_type
    WHEN 'written' THEN badge_type := 'written';
    WHEN 'oral' THEN badge_type := 'oral';
    WHEN 'physical' THEN badge_type := 'physical';
    WHEN 'polygraph' THEN badge_type := 'polygraph';
    WHEN 'psychological' THEN badge_type := 'psychological';
    ELSE RETURN;
  END CASE;
  
  -- Award the badge
  INSERT INTO badges (user_id, badge_type)
  VALUES (p_user_id, badge_type)
  ON CONFLICT (user_id, badge_type) DO NOTHING;
  
  -- Check if user has all test badges to award full badge
  IF (
    EXISTS (SELECT 1 FROM badges WHERE user_id = p_user_id AND badge_type = 'written') AND
    EXISTS (SELECT 1 FROM badges WHERE user_id = p_user_id AND badge_type = 'oral') AND
    EXISTS (SELECT 1 FROM badges WHERE user_id = p_user_id AND badge_type = 'physical') AND
    EXISTS (SELECT 1 FROM badges WHERE user_id = p_user_id AND badge_type = 'polygraph') AND
    EXISTS (SELECT 1 FROM badges WHERE user_id = p_user_id AND badge_type = 'psychological')
  ) THEN
    -- Award full badge
    INSERT INTO badges (user_id, badge_type)
    VALUES (p_user_id, 'full')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to award resource downloader badge
CREATE OR REPLACE FUNCTION award_resource_downloader_badge(
  p_user_id UUID
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO badges (user_id, badge_type)
  VALUES (p_user_id, 'resource-downloader')
  ON CONFLICT (user_id, badge_type) DO NOTHING;
END;
$$ LANGUAGE plpgsql;