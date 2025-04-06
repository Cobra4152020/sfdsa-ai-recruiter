-- This function creates the users table if it doesn't exist
CREATE OR REPLACE FUNCTION create_users_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
    CREATE TABLE public.users (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      participationCount INTEGER DEFAULT 0,
      hasApplied BOOLEAN DEFAULT FALSE,
      referralCount INTEGER DEFAULT 0,
      createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Add RLS (Row Level Security) policies if needed
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    
    -- Create policy for authenticated users (adjust as needed)
    CREATE POLICY "Users can view their own data" 
      ON public.users 
      FOR SELECT 
      USING (auth.uid() = id);
      
    CREATE POLICY "Users can update their own data" 
      ON public.users 
      FOR UPDATE 
      USING (auth.uid() = id);
      
    -- Allow service role full access (for admin operations)
    CREATE POLICY "Service role has full access" 
      ON public.users 
      USING (auth.role() = 'service_role');
      
    -- Create indexes for common queries
    CREATE INDEX idx_users_email ON public.users(email);
    CREATE INDEX idx_users_participation ON public.users(participationCount);
    CREATE INDEX idx_users_has_applied ON public.users(hasApplied);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to create the table
SELECT create_users_table_if_not_exists();

