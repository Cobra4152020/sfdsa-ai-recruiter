-- Create a function to create the pdf_cache table if it doesn't exist
CREATE OR REPLACE FUNCTION create_pdf_cache_table()
RETURNS void AS $$
BEGIN
  -- Check if the table already exists
  IF NOT EXISTS (
    SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'pdf_cache'
  ) THEN
    -- Create the table
    CREATE TABLE public.pdf_cache (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      filename TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL,
      cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Add index for faster lookups
    CREATE INDEX idx_pdf_cache_filename ON public.pdf_cache(filename);
    
    -- Add RLS policies
    ALTER TABLE public.pdf_cache ENABLE ROW LEVEL SECURITY;
    
    -- Allow service role full access
    CREATE POLICY "Service role has full access to pdf_cache"
      ON public.pdf_cache
      USING (auth.role() = 'service_role');
  END IF;
END;
$$ LANGUAGE plpgsql;
