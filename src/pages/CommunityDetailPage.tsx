import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Code2, Bug, MessageCircle, Heart, Globe, GitPullRequest, Star, Github, HeadphonesIcon, Users } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const pageContent: Record<string, {
  icon: any;
  color: string;
  sections: { titleKey: string; contentKey: string }[];
}> = {
  "getting-started": {
    icon: BookOpen,
    color: "text-blue-400",
    sections: [
      { titleKey: "community.gs.install", contentKey: "community.gs.installDesc" },
      { titleKey: "community.gs.setup", contentKey: "community.gs.setupDesc" },
      { titleKey: "community.gs.run", contentKey: "community.gs.runDesc" },
    ],
  },
  "api-docs": {
    icon: Code2,
    color: "text-emerald-400",
    sections: [
      { titleKey: "community.api.auth", contentKey: "community.api.authDesc" },
      { titleKey: "community.api.products", contentKey: "community.api.productsDesc" },
      { titleKey: "community.api.exchange", contentKey: "community.api.exchangeDesc" },
    ],
  },
  contributing: {
    icon: GitPullRequest,
    color: "text-purple-400",
    sections: [
      { titleKey: "community.contrib.fork", contentKey: "community.contrib.forkDesc" },
      { titleKey: "community.contrib.pr", contentKey: "community.contrib.prDesc" },
      { titleKey: "community.contrib.review", contentKey: "community.contrib.reviewDesc" },
    ],
  },
  faq: {
    icon: MessageCircle,
    color: "text-amber-400",
    sections: [
      { titleKey: "community.faq.q1", contentKey: "community.faq.a1" },
      { titleKey: "community.faq.q2", contentKey: "community.faq.a2" },
      { titleKey: "community.faq.q3", contentKey: "community.faq.a3" },
    ],
  },
  contributors: {
    icon: Heart,
    color: "text-pink-400",
    sections: [
      { titleKey: "community.contribs.core", contentKey: "community.contribs.coreDesc" },
      { titleKey: "community.contribs.community", contentKey: "community.contribs.communityDesc" },
    ],
  },
  "code-of-conduct": {
    icon: Globe,
    color: "text-cyan-400",
    sections: [
      { titleKey: "community.coc.respect", contentKey: "community.coc.respectDesc" },
      { titleKey: "community.coc.inclusive", contentKey: "community.coc.inclusiveDesc" },
      { titleKey: "community.coc.enforcement", contentKey: "community.coc.enforcementDesc" },
    ],
  },
};

const CommunityDetailPage = () => {
  const { slug } = useParams();
  const { t } = useI18n();
  const page = pageContent[slug || ""];

  if (!page) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-muted-foreground">Page not found</p>
      </div>
    );
  }

  const Icon = page.icon;

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
            <h1 className="font-display text-3xl font-bold">{t(`community.page.${slug}`)}</h1>
          </div>

          <div className="space-y-8">
            {page.sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-6"
              >
                <h2 className="font-display text-xl font-bold mb-3">{t(section.titleKey)}</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{t(section.contentKey)}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityDetailPage;
