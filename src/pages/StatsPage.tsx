import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Package, Handshake, Users } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const StatsPage = () => {
  const { t } = useI18n();

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const [products, users, offers] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("offers").select("*", { count: "exact", head: true }).eq("status", "accepted"),
      ]);
      return {
        totalProducts: products.count || 0,
        totalUsers: users.count || 0,
        totalExchanges: offers.count || 0,
      };
    },
  });

  const statItems = [
    { icon: Package, label: t("stats.totalProducts"), value: stats?.totalProducts?.toString() || "0" },
    { icon: Handshake, label: t("stats.exchanges"), value: stats?.totalExchanges?.toString() || "0" },
    { icon: Users, label: t("stats.activeUsers"), value: stats?.totalUsers?.toString() || "0" },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-3xl font-bold mb-8">
          <BarChart3 className="inline w-8 h-8 text-primary mr-2" />
          {t("stats.title")}
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {statItems.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-xl p-6">
              <stat.icon className="w-6 h-6 text-primary mb-3" />
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
