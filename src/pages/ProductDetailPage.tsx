import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, ArrowLeftRight, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { extractIdFromSlug } from "@/lib/utils";
import { seedProducts } from "@/lib/seedData";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const shortId = slug ? extractIdFromSlug(slug) : "";

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data: allProducts } = await supabase
        .from("products")
        .select("*, profiles(username, display_name, avatar_url, location, rating)")
        .order("created_at", { ascending: false });

      if (allProducts) {
        const found = allProducts.find((p: any) => p.id.startsWith(shortId) || p.id === shortId);
        if (found) return found;
      }

      const seedProduct = seedProducts.find(p => p.id.startsWith(shortId) || slug?.includes(p.id.slice(0, 8)));
      if (seedProduct) return seedProduct;

      return null;
    },
    enabled: !!slug,
  });

  // Fetch user's own products for exchange selection
  const { data: myProducts } = useQuery({
    queryKey: ["my-products", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("id, title, image_url, category")
        .eq("user_id", user!.id)
        .eq("is_available", true)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user && showExchangeModal,
  });

  const createOfferMutation = useMutation({
    mutationFn: async () => {
      if (!selectedProductId || !product || !user) throw new Error("Missing data");
      const { error } = await supabase.from("offers").insert({
        from_user_id: user.id,
        to_user_id: product.user_id,
        from_product_id: selectedProductId,
        to_product_id: product.id,
        message: message.trim() || null,
        status: "pending",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: t("offer.sent") || "Teklif gönderildi!", description: t("offer.sent.desc") || "Takas teklifiniz başarıyla iletildi." });
      setShowExchangeModal(false);
      setSelectedProductId(null);
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
    onError: (err: any) => {
      toast({ title: t("error") || "Hata", description: err.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return <div className="min-h-screen pt-20 flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  }

  if (!product) {
    return <div className="min-h-screen pt-20 flex items-center justify-center"><p className="text-muted-foreground">Product not found</p></div>;
  }

  const profile = (product as any).profiles;
  const isOwner = user?.id === product.user_id;
  const isSeedProduct = product.id?.startsWith("seed-");

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
                <Link to={`/users/${profile.username}`} className="glass-card rounded-xl p-4 flex items-center gap-4 hover:glow-border transition-all">
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

              {!isOwner && user && !isSeedProduct && (
                <Button
                  onClick={() => setShowExchangeModal(true)}
                  className="w-full bg-primary text-primary-foreground font-display font-bold h-12 gap-2"
                >
                  <ArrowLeftRight className="w-5 h-5" /> {t("propose.exchange") || "Takas Teklifi Gönder"}
                </Button>
              )}

              {!user && (
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="w-full border-border font-display h-12 gap-2"
                >
                  {t("login.to.exchange") || "Takas teklifi göndermek için giriş yapın"}
                </Button>
              )}

              {isSeedProduct && (
                <p className="text-sm text-muted-foreground text-center italic">
                  {t("seed.product.info") || "Bu örnek bir üründür. Gerçek ürünlere teklif gönderebilirsiniz."}
                </p>
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

      {/* Exchange Proposal Modal */}
      <AnimatePresence>
        {showExchangeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowExchangeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-foreground">
                  {t("propose.exchange") || "Takas Teklifi"}
                </h2>
                <button onClick={() => setShowExchangeModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Target product info */}
              <div className="glass-card rounded-xl p-3 mb-4 flex items-center gap-3">
                {product.image_url ? (
                  <img src={product.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xl">📦</div>
                )}
                <div>
                  <p className="font-display font-bold text-sm text-foreground">{product.title}</p>
                  <p className="text-xs text-muted-foreground">{profile?.display_name || profile?.username || "User"}</p>
                </div>
                <ArrowLeftRight className="w-4 h-4 text-primary ml-auto" />
              </div>

              {/* Select your product */}
              <label className="block text-sm font-semibold text-foreground mb-2">
                {t("select.your.product") || "Takas için ürününüzü seçin"}
              </label>

              {!myProducts || myProducts.length === 0 ? (
                <div className="glass-card rounded-xl p-4 text-center mb-4">
                  <p className="text-muted-foreground text-sm mb-2">
                    {t("no.products.to.exchange") || "Takas için ürününüz yok."}
                  </p>
                  <Button size="sm" onClick={() => navigate("/products/new")} className="bg-primary text-primary-foreground">
                    {t("add.product") || "Ürün Ekle"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {myProducts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProductId(p.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                        selectedProductId === p.id
                          ? "border-primary bg-primary/10 ring-1 ring-primary"
                          : "border-border/50 hover:border-primary/50"
                      }`}
                    >
                      {p.image_url ? (
                        <img src={p.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">📦</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-sm text-foreground truncate">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{t(categoryLabels[p.category] || "other")}</p>
                      </div>
                      {selectedProductId === p.id && (
                        <span className="text-primary text-lg">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Message */}
              <label className="block text-sm font-semibold text-foreground mb-2">
                {t("message.optional") || "Mesaj (isteğe bağlı)"}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("exchange.message.placeholder") || "Merhaba, bu ürünle takas yapmak isterim..."}
                className="w-full p-3 rounded-xl border border-border/50 bg-background text-foreground placeholder:text-muted-foreground resize-none h-20 focus:outline-none focus:ring-1 focus:ring-primary mb-4"
              />

              {/* Submit */}
              <Button
                onClick={() => createOfferMutation.mutate()}
                disabled={!selectedProductId || createOfferMutation.isPending}
                className="w-full bg-primary text-primary-foreground font-display font-bold h-12 gap-2"
              >
                {createOfferMutation.isPending ? (
                  <span className="animate-pulse">{t("sending") || "Gönderiliyor..."}</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> {t("send.offer") || "Teklifi Gönder"}
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;
