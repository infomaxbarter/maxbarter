import { motion } from "framer-motion";
import { User, MapPin, Mail, Edit, Package, Handshake, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { t } = useI18n();
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: productCount = 0 } = useQuery({
    queryKey: ["my-product-count", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count, error } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });

  if (!user) return <div className="min-h-screen pt-20 flex items-center justify-center"><p className="text-muted-foreground">Please log in</p></div>;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-primary" />
              )}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="font-display text-3xl font-bold text-foreground">{profile?.display_name || profile?.username || "User"}</h1>
              <p className="text-sm text-muted-foreground">@{profile?.username}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-sm text-muted-foreground">
                {profile?.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>}
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {user.email}</span>
              </div>
              {profile?.bio && <p className="text-sm text-muted-foreground mt-2">{profile.bio}</p>}
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= (profile?.rating || 0) ? "text-primary fill-primary" : "text-muted-foreground"}`} />
                ))}
              </div>
            </div>
            <Button variant="outline" className="border-border gap-2"><Edit className="w-4 h-4" /> {t("profile.edit")}</Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Package, label: t("profile.products"), value: productCount.toString() },
            { icon: Handshake, label: t("profile.exchanges"), value: (profile?.total_exchanges || 0).toString() },
            { icon: Star, label: t("profile.rating"), value: (profile?.rating || 0).toString() },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-xl p-6 text-center">
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
