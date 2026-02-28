
-- Add image_url to exchange_requests
ALTER TABLE public.exchange_requests ADD COLUMN IF NOT EXISTS image_url text;

-- Add latitude/longitude to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS latitude double precision;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS longitude double precision;

-- Add latitude/longitude to exchange_requests
ALTER TABLE public.exchange_requests ADD COLUMN IF NOT EXISTS latitude double precision;
ALTER TABLE public.exchange_requests ADD COLUMN IF NOT EXISTS longitude double precision;

-- Add latitude/longitude to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS latitude double precision;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS longitude double precision;
