import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Package, Handshake, Users } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const StatsPage = () => {
  const { t } = useI18n();

  const stats = [
    { icon: Package, label: t("stats.totalProducts"), value: "1,247", change: "+12%" },
    { icon: Handshake, label: t("stats.exchanges"), value: "856", change: "+8%" },
    { icon: Users, label: t("stats.activeUsers"), value: "2,341", change: "+15%" },
    { icon: TrendingUp, label: t("stats.todayOffers"), value: "45", change: "+23%" },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-3xl font-bold mb-8">
          <BarChart3 className="inline w-8 h-8 text-primary mr-2" />
          {t("stats.title")}
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-6 h-6 text-primary" />
                <span className="text-xs font-medium text-emerald-500">{stat.change}</span>
              </div>
              <div className="font-display text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-muted-foreground">{t("stats.comingSoon")}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
