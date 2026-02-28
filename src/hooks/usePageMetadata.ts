import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePageMetadata = (pagePath: string) => {
  const { data: metadata } = useQuery({
    queryKey: ["page-metadata", pagePath],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("page_metadata")
        .select("*")
        .eq("page_path", pagePath)
        .maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (!metadata) return;

    if (metadata.title) {
      document.title = metadata.title;
    }

    const setMeta = (name: string, content: string, isProperty = false) => {
      if (!content) return;
      const attr = isProperty ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    if (metadata.description) {
      setMeta("description", metadata.description);
      setMeta("og:description", metadata.description, true);
      setMeta("twitter:description", metadata.description);
    }

    if (metadata.title) {
      setMeta("og:title", metadata.title, true);
      setMeta("twitter:title", metadata.title);
    }

    if (metadata.social_image_url) {
      setMeta("og:image", metadata.social_image_url, true);
      setMeta("twitter:image", metadata.social_image_url);
    }

    if (metadata.icon_url) {
      let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = metadata.icon_url;
    }
  }, [metadata]);

  return metadata;
};
