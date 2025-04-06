# SF Sheriff Recruitment Application

## Database Configuration

This application uses Supabase for database storage. The database schema includes:

### Tables

1. **users**
   - `id` (UUID): Primary key
   - `name` (TEXT): User's full name
   - `email` (TEXT): User's email address (unique)
   - `phone` (TEXT): User's phone number
   - `participationCount` (INTEGER): Number of interactions with the chatbot
   - `hasApplied` (BOOLEAN): Whether the user has applied
   - `referralCount` (INTEGER): Number of referrals
   - `createdAt` (TIMESTAMP): When the user was created
   - `updatedAt` (TIMESTAMP): When the user was last updated

### Setting Up Supabase

1. The application automatically creates the necessary tables if they don't exist
2. You can also manually import the SQL migration files to Supabase SQL Editor:
   - `supabase/migrations/20230501000000_create_users_table.sql`

### Environment Variables

The following environment variables need to be set:

