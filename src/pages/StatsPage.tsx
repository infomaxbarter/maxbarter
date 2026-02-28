import { motion } from "framer-motion";
import { BarChart3, Package, Handshake, Users, ArrowLeftRight, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { seedProducts, seedProfiles, seedOffers, seedExchangeRequests } from "@/lib/seedData";

const StatsPage = () => {
  const { t } = useI18n();

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const [products, users, offers, requests] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("offers").select("*", { count: "exact", head: true }),
        supabase.from("exchange_requests").select("*", { count: "exact", head: true }),
      ]);

      const [acceptedOffers, pendingOffers, activeRequests] = await Promise.all([
        supabase.from("offers").select("*", { count: "exact", head: true }).eq("status", "accepted"),
        supabase.from("offers").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("exchange_requests").select("*", { count: "exact", head: true }).eq("status", "active"),
      ]);

      const hasData = (products.count || 0) > 0;

      return {
        totalProducts: hasData ? products.count || 0 : seedProducts.length,
        totalUsers: hasData ? users.count || 0 : seedProfiles.length,
        totalOffers: hasData ? offers.count || 0 : seedOffers.length,
        totalRequests: hasData ? requests.count || 0 : seedExchangeRequests.length,
        acceptedOffers: hasData ? acceptedOffers.count || 0 : seedOffers.filter(o => o.status === "accepted").length,
        pendingOffers: hasData ? pendingOffers.count || 0 : seedOffers.filter(o => o.status === "pending").length,
        activeRequests: hasData ? activeRequests.count || 0 : seedExchangeRequests.filter(r => r.status === "active").length,
      };
    },
  });

  const statItems = [
    { icon: Package, label: t("stats.totalProducts"), value: stats?.totalProducts?.toString() || "0", color: "text-blue-400" },
    { icon: Users, label: t("stats.activeUsers"), value: stats?.totalUsers?.toString() || "0", color: "text-emerald-400" },
    { icon: Handshake, label: t("stats.exchanges"), value: stats?.acceptedOffers?.toString() || "0", color: "text-primary" },
    { icon: ArrowLeftRight, label: t("admin.totalRequests"), value: stats?.totalRequests?.toString() || "0", color: "text-purple-400" },
    { icon: Clock, label: t("admin.pendingOffers"), value: stats?.pendingOffers?.toString() || "0", color: "text-amber-400" },
    { icon: TrendingUp, label: t("admin.totalOffers"), value: stats?.totalOffers?.toString() || "0", color: "text-pink-400" },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-3xl font-bold mb-8">
          <BarChart3 className="inline w-8 h-8 text-primary mr-2" />{t("stats.title")}
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {statItems.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                <span className="font-display text-3xl font-bold text-foreground">{stat.value}</span>
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
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
