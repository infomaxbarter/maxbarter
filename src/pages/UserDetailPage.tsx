import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Star, Package } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { makeProductSlug } from "@/lib/utils";
import { seedProfiles, seedProducts } from "@/lib/seedData";

const categoryLabels: Record<string, string> = {
  electronics: "cat.electronics", music: "cat.music", sports: "cat.sports",
  books: "cat.books", clothing: "cat.clothing", gaming: "cat.gaming",
  home: "cat.home", other: "other",
};

const UserDetailPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      // Try by username first
      const { data, error } = await supabase.from("profiles").select("*").eq("username", username!).single();
      if (!error && data) return data;

      // Try by user_id (backward compat)
      const { data: data2 } = await supabase.from("profiles").select("*").eq("user_id", username!).single();
      if (data2) return data2;

      // Seed fallback
      const seedProfile = seedProfiles.find(p => p.username === username || p.user_id === username);
      return seedProfile || null;
    },
    enabled: !!username,
  });

  const userId = profile?.user_id;

  const { data: dbProducts = [] } = useQuery({
    queryKey: ["user-products", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("user_id", userId!).eq("is_available", true).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId && !userId.startsWith("seed-"),
  });

  const products = userId?.startsWith("seed-")
    ? seedProducts.filter(p => p.user_id === userId)
    : dbProducts;

  if (profileLoading) {
    return <div className="min-h-screen pt-20 flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  }

  if (!profile) {
    return <div className="min-h-screen pt-20 flex items-center justify-center"><p className="text-muted-foreground">User not found</p></div>;
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="glass-card rounded-2xl p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display font-bold text-primary text-3xl">{profile.username[0]}</span>
                )}
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="font-display text-3xl font-bold text-foreground">{profile.display_name || profile.username}</h1>
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-sm text-muted-foreground">
                  {profile.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>}
                  {profile.rating && profile.rating > 0 && (
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-primary" /> {profile.rating}</span>
                  )}
                </div>
                {profile.bio && <p className="text-sm text-muted-foreground mt-3">{profile.bio}</p>}
              </div>
              <div className="glass-card rounded-xl px-6 py-4 text-center">
                <Package className="w-6 h-6 text-primary mx-auto mb-1" />
                <div className="font-display text-xl font-bold text-foreground">{products.length}</div>
                <div className="text-xs text-muted-foreground">{t("profile.products")}</div>
              </div>
            </div>
          </div>

          <h2 className="font-display text-xl font-bold mb-4">{t("nav.products")}</h2>
          {products.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">{t("home.noProducts")}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product: any, i: number) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/productos/${makeProductSlug(product.title, product.id)}`}>
                    <div className="glass-card rounded-lg overflow-hidden group cursor-pointer hover:-translate-y-1 transition-transform">
                      <div className="h-40 overflow-hidden bg-muted">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{product.title}</h3>
                        <span className="text-xs text-muted-foreground">{t(categoryLabels[product.category] || "other")}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserDetailPage;
