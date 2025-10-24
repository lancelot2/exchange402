-- Add wallet column to api_calls table
ALTER TABLE public.api_calls 
ADD COLUMN wallet_address TEXT;