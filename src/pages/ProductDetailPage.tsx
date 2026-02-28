import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { extractIdFromSlug, makeProductSlug } from "@/lib/utils";
import { seedProducts } from "@/lib/seedData";

const categoryLabels: Record<string, string> = {
  electronics: "cat.electronics", music: "cat.music", sports: "cat.sports",
  books: "cat.books", clothing: "cat.clothing", gaming: "cat.gaming",
  home: "cat.home", other: "other",
};

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { user } = useAuth();

  const shortId = slug ? extractIdFromSlug(slug) : "";

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      // Try by short ID first (first 8 chars of uuid)
      const { data: allProducts } = await supabase
        .from("products")
        .select("*, profiles(username, display_name, avatar_url, location, rating)")
        .order("created_at", { ascending: false });

      if (allProducts) {
        const found = allProducts.find((p: any) => p.id.startsWith(shortId) || p.id === shortId);
        if (found) return found;
      }

      // Fallback: try seed data
      const seedProduct = seedProducts.find(p => p.id.startsWith(shortId) || slug?.includes(p.id.slice(0, 8)));
      if (seedProduct) return seedProduct;

      return null;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return <div className="min-h-screen pt-20 flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  }

  if (!product) {
    return <div className="min-h-screen pt-20 flex items-center justify-center"><p className="text-muted-foreground">Product not found</p></div>;
  }

  const profile = (product as any).profiles;
  const isOwner = user?.id === product.user_id;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card rounded-xl overflow-hidden">
              {product.image_url ? (
                <img src={product.image_url} alt={product.title} className="w-full h-80 lg:h-full object-cover" />
              ) : (
                <div className="w-full h-80 lg:h-full flex items-center justify-center text-6xl bg-muted">📦</div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary mb-3">
                  {t(categoryLabels[product.category] || "other")}
                </span>
                <h1 className="font-display text-3xl font-bold text-foreground">{product.title}</h1>
              </div>

              {product.description && (
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {product.location && (
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-primary" /> {product.location}</span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  {new Date(product.created_at).toLocaleDateString()}
                </span>
              </div>

              {profile && (
                <Link to={`/usuarios/${profile.username}`} className="glass-card rounded-xl p-4 flex items-center gap-4 hover:glow-border transition-all">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-display font-bold text-primary text-lg">{profile.username?.[0] || "?"}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-display font-bold text-foreground">{profile.display_name || profile.username}</p>
                    <p className="text-xs text-muted-foreground">{profile.location || ""} {profile.rating ? `★ ${profile.rating}` : ""}</p>
                  </div>
                </Link>
              )}

              {!isOwner && user && (
                <Button className="w-full bg-primary text-primary-foreground font-display font-bold h-12 gap-2">
                  <ArrowLeftRight className="w-5 h-5" /> Propose Exchange
                </Button>
              )}

              {isOwner && (
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 border-border">Edit</Button>
                  <Button variant="destructive" className="flex-1">Delete</Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
