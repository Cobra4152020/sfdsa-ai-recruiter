-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  participation_count INTEGER DEFAULT 0,
  has_applied BOOLEAN DEFAULT FALSE,
  referral_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies if needed
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (adjust as needed)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view their own data'
  ) THEN
    CREATE POLICY "Users can view their own data" 
      ON public.users 
      FOR SELECT 
      USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update their own data'
  ) THEN
    CREATE POLICY "Users can update their own data" 
      ON public.users 
      FOR UPDATE 
      USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'users' AND policyname = 'Service role has full access'
  ) THEN
    CREATE POLICY "Service role has full access" 
      ON public.users 
      USING (auth.role() = 'service_role');
  END IF;
END
$$;

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_participation ON public.users(participation_count);
CREATE INDEX IF NOT EXISTS idx_users_has_applied ON public.users(has_applied);