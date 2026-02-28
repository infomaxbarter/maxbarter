
CREATE TABLE public.page_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  icon_url TEXT DEFAULT NULL,
  social_image_url TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.page_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view page metadata"
  ON public.page_metadata FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage page metadata"
  ON public.page_metadata FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
