
-- Allow admins to do everything on products
CREATE POLICY "Admins can manage all products"
ON public.products FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to do everything on offers
CREATE POLICY "Admins can manage all offers"
ON public.offers FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to do everything on profiles
CREATE POLICY "Admins can manage all profiles"
ON public.profiles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
