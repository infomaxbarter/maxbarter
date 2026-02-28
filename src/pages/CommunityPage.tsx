import { motion } from "framer-motion";
import { useI18n } from "@/contexts/I18nContext";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Github, BookOpen, HeadphonesIcon, Users, Heart,
  GitPullRequest, Bug, MessageCircle, Star, Code2, Globe
} from "lucide-react";

const GITHUB_ORG = "AliHafeez337";
const GITHUB_REPO = "maxbarter";
const GITHUB_URL = `https://github.com/${GITHUB_ORG}/${GITHUB_REPO}`;

const CommunityPage = () => {
  const { t, language } = useI18n();

  // Fetch community pages from DB
  const { data: communityPages = [] } = useQuery({
    queryKey: ["community-pages"],
    queryFn: async () => {
      const { data } = await (supabase as any).from("community_pages").select("*").eq("is_published", true).order("sort_order");
      return data || [];
    },
  });

  const sections = [
    {
      key: "github",
      icon: Github,
      color: "text-foreground",
      bgColor: "bg-foreground/10",
      links: [
        { label: t("community.viewRepo"), url: GITHUB_URL, icon: Code2, external: true },
        { label: t("community.issues"), url: `${GITHUB_URL}/issues`, icon: Bug, external: true },
        { label: t("community.pullRequests"), url: `${GITHUB_URL}/pulls`, icon: GitPullRequest, external: true },
        { label: t("community.starUs"), url: GITHUB_URL, icon: Star, external: true },
      ],
    },
    {
      key: "docs",
      icon: BookOpen,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      links: communityPages
        .filter((p: any) => ["getting-started", "api-docs", "contributing"].includes(p.slug))
        .map((p: any) => ({
          label: p[`title_${language}`] || p.title_en,
          url: `/community/${p.slug}`,
          icon: BookOpen,
          external: false,
        })),
    },
    {
      key: "support",
      icon: HeadphonesIcon,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      links: [
        { label: t("community.reportBug"), url: `${GITHUB_URL}/issues/new`, icon: Bug, external: true },
        { label: t("community.discussions"), url: `${GITHUB_URL}/discussions`, icon: MessageCircle, external: true },
        ...communityPages
          .filter((p: any) => p.slug === "faq")
          .map((p: any) => ({
            label: p[`title_${language}`] || p.title_en,
            url: `/community/${p.slug}`,
            icon: BookOpen,
            external: false,
          })),
      ],
    },
    {
      key: "community",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      links: [
        { label: "Discord", url: `https://discord.gg/${GITHUB_REPO}`, icon: MessageCircle, external: true },
        ...communityPages
          .filter((p: any) => ["contributors", "code-of-conduct"].includes(p.slug))
          .map((p: any) => ({
            label: p[`title_${language}`] || p.title_en,
            url: `/community/${p.slug}`,
            icon: Heart,
            external: false,
          })),
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Heart className="w-4 h-4" /> {t("community.openSource")}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            {t("community.title")} <span className="text-gradient">MaxBarter</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{t("community.subtitle")}</p>
        </motion.div>

        {/* Open Source Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-8 mb-12 glow-border text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Github className="w-10 h-10" />
            <span className="font-display text-2xl font-bold">{t("community.freeAndOpen")}</span>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">{t("community.openSourceDesc")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
              <Github className="w-5 h-5" /> {t("community.viewOnGithub")}
            </a>
            <a href={`${GITHUB_URL}/fork`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors">
              <GitPullRequest className="w-5 h-5" /> {t("community.forkProject")}
            </a>
          </div>
        </motion.div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.div key={section.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-12 h-12 rounded-xl ${section.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${section.color}`} />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold">{t(`community.${section.key}.title`)}</h2>
                    <p className="text-sm text-muted-foreground">{t(`community.${section.key}.desc`)}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {section.links.map((link, j) => {
                    const LinkIcon = link.icon;
                    const content = (
                      <div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors group">
                        <div className="flex items-center gap-3">
                          <LinkIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{link.label}</span>
                        </div>
                        <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </div>
                    );
                    return link.external ? (
                      <a key={j} href={link.url} target="_blank" rel="noopener noreferrer">{content}</a>
                    ) : (
                      <Link key={j} to={link.url}>{content}</Link>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mission */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-card rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold mb-4">{t("community.missionTitle")}</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t("community.missionDesc")}</p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {["C2C", t("community.tagCircularEconomy"), t("community.tagOpenSource"), t("community.tagSocialEnterprise")].map((tag) => (
              <span key={tag} className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">{tag}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityPage;
