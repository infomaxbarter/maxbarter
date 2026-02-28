import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { seedProfiles, withSeedFallback } from "@/lib/seedData";

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const { t } = useI18n();

  const { data: dbUsers = [], isLoading } = useQuery({
    queryKey: ["users", search],
    queryFn: async () => {
      let query = supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (search) {
        query = query.or(`username.ilike.%${search}%,display_name.ilike.%${search}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const allUsers = withSeedFallback(dbUsers, seedProfiles as any);
  const users = dbUsers.length > 0 ? allUsers : allUsers.filter((u: any) =>
    !search || u.username?.toLowerCase().includes(search.toLowerCase()) || u.display_name?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status?: string) => {
    switch (status) {
      case "online": return "bg-emerald-500";
      case "offline": return "bg-muted-foreground/40";
      case "passive": return "bg-amber-500";
      case "demo": return "bg-indigo-500";
      case "coming_soon": return "bg-purple-500";
      default: return "bg-emerald-500";
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-4">{t("users.title")}</h1>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder={t("users.search")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-secondary border-border focus:border-primary" />
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <div key={i} className="glass-card rounded-xl h-28 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {users.map((user: any, i: number) => (
              <motion.div key={user.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/usuarios/${user.username}`}>
                  <div className="glass-card rounded-xl p-5 hover:glow-border transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-display font-bold text-primary text-lg">{user.username[0]}</span>
                        )}
                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${statusColor(user.status)}`} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display font-bold text-foreground">{user.display_name || user.username}</h3>
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                        {user.location && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {user.location}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                      <span>{user.total_exchanges || 0} {t("profile.exchanges").toLowerCase()}</span>
                      {user.rating && user.rating > 0 && <span className="text-primary font-medium">★ {user.rating}</span>}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
