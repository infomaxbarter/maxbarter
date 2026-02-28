
-- Add FK from products to profiles for PostgREST join support
ALTER TABLE public.products
  ADD CONSTRAINT products_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Exchange requests table for barter requests
CREATE TYPE public.request_type AS ENUM ('product', 'service');
CREATE TYPE public.request_status AS ENUM ('pending', 'active', 'matched', 'completed', 'cancelled', 'coming_soon');

CREATE TABLE public.exchange_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  is_anonymous boolean NOT NULL DEFAULT false,
  title text NOT NULL,
  description text,
  type request_type NOT NULL DEFAULT 'product',
  category text NOT NULL DEFAULT 'other',
  offer_description text NOT NULL,
  request_description text NOT NULL,
  location text,
  status request_status NOT NULL DEFAULT 'pending',
  matched_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  matched_product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.exchange_requests ENABLE ROW LEVEL SECURITY;

-- Everyone can view active/pending requests
CREATE POLICY "Anyone can view exchange requests"
  ON public.exchange_requests FOR SELECT USING (true);

-- Authenticated users can create requests
CREATE POLICY "Authenticated users can create requests"
  ON public.exchange_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR is_anonymous = true);

-- Users can update own requests
CREATE POLICY "Users can update own requests"
  ON public.exchange_requests FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Admins can manage all requests
CREATE POLICY "Admins can manage all exchange requests"
  ON public.exchange_requests FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow anonymous (non-authenticated) inserts for anonymous requests
CREATE POLICY "Anonymous can create requests"
  ON public.exchange_requests FOR INSERT TO anon
  WITH CHECK (is_anonymous = true AND user_id IS NULL);

-- Proposals/responses on exchange requests
CREATE TABLE public.exchange_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.exchange_requests(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  is_anonymous boolean NOT NULL DEFAULT false,
  message text NOT NULL,
  contact_info text,
  status request_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.exchange_proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view proposals"
  ON public.exchange_proposals FOR SELECT USING (true);

CREATE POLICY "Anyone can create proposals"
  ON public.exchange_proposals FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage proposals"
  ON public.exchange_proposals FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_exchange_requests_updated_at
  BEFORE UPDATE ON public.exchange_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
