import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { makeProductSlug } from "@/lib/utils";
import { seedProducts, withSeedFallback } from "@/lib/seedData";

const categoryKeys: Record<string, string> = {
  all: "home.all", electronics: "cat.electronics", music: "cat.music", sports: "cat.sports",
  books: "cat.books", clothing: "cat.clothing", gaming: "cat.gaming", home: "cat.home", other: "other",
};

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { t } = useI18n();
  const { user } = useAuth();

  const { data: dbProducts = [], isLoading } = useQuery({
    queryKey: ["products", selectedCategory, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*, profiles(username, display_name, avatar_url)")
        .eq("is_available", true)
        .order("created_at", { ascending: false });

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory as any);
      }
      if (searchTerm) {
        query = query.ilike("title", `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const products = withSeedFallback(dbProducts, seedProducts as any);

  // Client-side filter for seed data
  const filteredProducts = dbProducts.length > 0 ? products : products.filter((p: any) => {
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
    if (searchTerm && !p.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder={t("home.search")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-secondary border-border focus:border-primary" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(categoryKeys).map(([key, labelKey]) => (
              <button key={key} onClick={() => setSelectedCategory(key)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedCategory === key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                {t(labelKey)}
              </button>
            ))}
          </div>
          {user && (
            <Link to="/productos/nuevo">
              <Button size="sm" className="bg-primary text-primary-foreground gap-2">
                <Plus className="w-4 h-4" /> {t("nav.products")}
              </Button>
            </Link>
          )}
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card rounded-lg h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product: any, i: number) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03, duration: 0.4 }}>
                <Link to={`/productos/${makeProductSlug(product.title, product.id)}`}>
                  <div className="glass-card rounded-lg overflow-hidden group cursor-pointer hover:-translate-y-1 transition-transform">
                    <div className="relative h-48 overflow-hidden bg-muted">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">📦</div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/90 text-primary-foreground">
                          {t(categoryKeys[product.category] || "other")}
                        </span>
                      </div>
                      {product.status && product.status !== "active" && (
                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            product.status === "demo" ? "bg-indigo-500/90 text-white" :
                            product.status === "passive" ? "bg-amber-500/90 text-white" :
                            product.status === "coming_soon" ? "bg-purple-500/90 text-white" :
                            product.status === "offline" ? "bg-muted text-muted-foreground" :
                            "bg-secondary text-foreground"
                          }`}>
                            {product.status === "demo" ? "Demo" : product.status === "passive" ? "Pasif" : product.status === "coming_soon" ? "Yakında" : product.status === "offline" ? "Offline" : product.status}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{product.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">{(product.profiles as any)?.username?.[0] || "?"}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{(product.profiles as any)?.display_name || (product.profiles as any)?.username}</span>
                        </div>
                        {product.location && <span className="text-xs text-muted-foreground">{product.location}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">{t("home.noProducts")}</p>
            {user && (
              <Link to="/productos/nuevo">
                <Button className="mt-4 bg-primary text-primary-foreground gap-2"><Plus className="w-4 h-4" /> Add Product</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
