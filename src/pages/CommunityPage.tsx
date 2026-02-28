import { motion } from "framer-motion";
import { useI18n } from "@/contexts/I18nContext";
import {
  Github, BookOpen, HeadphonesIcon, Users, ExternalLink, Heart,
  GitPullRequest, Bug, MessageCircle, Star, Code2, Globe
} from "lucide-react";

const CommunityPage = () => {
  const { t } = useI18n();

  const sections = [
    {
      key: "github",
      icon: Github,
      color: "text-foreground",
      bgColor: "bg-foreground/10",
      links: [
        { label: t("community.viewRepo"), url: "https://github.com/maxbarter", icon: Code2 },
        { label: t("community.issues"), url: "https://github.com/maxbarter/issues", icon: Bug },
        { label: t("community.pullRequests"), url: "https://github.com/maxbarter/pulls", icon: GitPullRequest },
        { label: t("community.starUs"), url: "https://github.com/maxbarter", icon: Star },
      ],
    },
    {
      key: "docs",
      icon: BookOpen,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      links: [
        { label: t("community.gettingStarted"), url: "#", icon: BookOpen },
        { label: t("community.apiDocs"), url: "#", icon: Code2 },
        { label: t("community.contributing"), url: "#", icon: GitPullRequest },
      ],
    },
    {
      key: "support",
      icon: HeadphonesIcon,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      links: [
        { label: t("community.reportBug"), url: "https://github.com/maxbarter/issues/new", icon: Bug },
        { label: t("community.discussions"), url: "https://github.com/maxbarter/discussions", icon: MessageCircle },
        { label: t("community.faq"), url: "#", icon: BookOpen },
      ],
    },
    {
      key: "community",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      links: [
        { label: "Discord", url: "#", icon: MessageCircle },
        { label: t("community.contributors"), url: "#", icon: Heart },
        { label: t("community.codeOfConduct"), url: "#", icon: Globe },
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Heart className="w-4 h-4" /> {t("community.openSource")}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            {t("community.title")} <span className="text-gradient">MaxBarter</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{t("community.subtitle")}</p>
        </motion.div>

        {/* Open Source Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-8 mb-12 glow-border text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Github className="w-10 h-10" />
            <span className="font-display text-2xl font-bold">{t("community.freeAndOpen")}</span>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">{t("community.openSourceDesc")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://github.com/maxbarter"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <Github className="w-5 h-5" /> {t("community.viewOnGithub")}
            </a>
            <a
              href="https://github.com/maxbarter/fork"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors"
            >
              <GitPullRequest className="w-5 h-5" /> {t("community.forkProject")}
            </a>
          </div>
        </motion.div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="glass-card rounded-xl p-6"
              >
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
                    return (
                      <a
                        key={j}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <LinkIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{link.label}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Social Enterprise Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-8 text-center"
        >
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
