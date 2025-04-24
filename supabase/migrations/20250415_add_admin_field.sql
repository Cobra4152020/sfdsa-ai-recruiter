-- Add is_admin field to users table
ALTER TABLE public.users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Create admin user function
CREATE OR REPLACE FUNCTION make_user_admin(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users
  SET is_admin = TRUE
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Add RLS policy for is_admin field
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);
  
CREATE POLICY "Admin users can view all data" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
  
CREATE POLICY "Admin users can update all data" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
