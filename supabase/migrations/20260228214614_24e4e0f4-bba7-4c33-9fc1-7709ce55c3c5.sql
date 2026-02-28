
-- Fix overly permissive proposal insert policy
DROP POLICY "Anyone can create proposals" ON public.exchange_proposals;

CREATE POLICY "Authenticated users can create proposals"
  ON public.exchange_proposals FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR is_anonymous = true);

CREATE POLICY "Anonymous can create proposals"
  ON public.exchange_proposals FOR INSERT TO anon
  WITH CHECK (is_anonymous = true AND user_id IS NULL);
