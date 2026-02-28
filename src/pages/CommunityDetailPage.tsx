import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Code2, GitPullRequest, MessageCircle, Heart, Globe } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, any> = {
  BookOpen, Code2, GitPullRequest, MessageCircle, Heart, Globe,
};

const CommunityDetailPage = () => {
  const { slug } = useParams();
  const { t, language } = useI18n();

  const { data: page, isLoading } = useQuery({
    queryKey: ["community-page", slug],
    queryFn: async () => {
      const { data } = await (supabase as any).from("community_pages").select("*").eq("slug", slug).eq("is_published", true).single();
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-muted-foreground">Page not found</p>
      </div>
    );
  }

  const Icon = iconMap[page.icon] || BookOpen;
  const title = page[`title_${language}`] || page.title_en;
  const content = page[`content_${language}`] || page.content_en;

  // Simple markdown-like rendering
  const renderContent = (text: string) => {
    return text.split('\n').map((line: string, i: number) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="font-display text-xl font-bold mt-6 mb-3">{line.slice(3)}</h2>;
      }
      if (line.startsWith('```')) return null;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-muted-foreground leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/community" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" /> {t("community.title")}
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${page.color}`} />
            </div>
            <h1 className="font-display text-3xl font-bold">{title}</h1>
          </div>

          <div className="glass-card rounded-xl p-6">
            {renderContent(content)}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityDetailPage;
