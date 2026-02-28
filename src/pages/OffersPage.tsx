import { motion } from "framer-motion";
import { ArrowLeftRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const OffersPage = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["offers", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("offers")
        .select(`
          *,
          from_product:products!offers_from_product_id_fkey(title, image_url),
          to_product:products!offers_to_product_id_fkey(title, image_url)
        `)
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const updateOfferStatus = async (offerId: string, status: "accepted" | "rejected") => {
    const { error } = await supabase.from("offers").update({ status }).eq("id", offerId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast({ title: "✅", description: status === "accepted" ? t("offers.accepted") : t("offers.rejected") });
    }
  };

  const statusStyles: Record<string, string> = {
    pending: "bg-amber-500/20 text-amber-400",
    accepted: "bg-emerald-500/20 text-emerald-400",
    rejected: "bg-destructive/20 text-destructive",
    cancelled: "bg-muted text-muted-foreground",
  };

  const statusLabels: Record<string, string> = {
    pending: t("offers.pending"),
    accepted: t("offers.accepted"),
    rejected: t("offers.rejected"),
    cancelled: "Cancelled",
  };

  if (!user) return <div className="min-h-screen pt-20 flex items-center justify-center"><p className="text-muted-foreground">Please log in</p></div>;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-3xl font-bold mb-8">
          {t("offers.title")}
        </motion.h1>

        {isLoading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="glass-card rounded-xl h-24 animate-pulse" />)}</div>
        ) : offers.length === 0 ? (
          <div className="text-center py-20"><p className="text-muted-foreground">{t("home.noProducts")}</p></div>
        ) : (
          <div className="space-y-4">
            {offers.map((offer: any, i: number) => (
              <motion.div key={offer.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-3 flex-1 min-w-[180px]">
                    {offer.from_product?.image_url && <img src={offer.from_product.image_url} alt="" className="w-14 h-10 rounded-md object-cover" />}
                    <div>
                      <p className="text-sm font-medium text-foreground">{offer.from_product?.title || "Product"}</p>
                      <p className="text-xs text-muted-foreground">{offer.from_profile?.display_name || offer.from_profile?.username || "User"}</p>
                    </div>
                  </div>

                  <ArrowLeftRight className="w-5 h-5 text-primary shrink-0" />

                  <div className="flex items-center gap-3 flex-1 min-w-[180px]">
                    {offer.to_product?.image_url && <img src={offer.to_product.image_url} alt="" className="w-14 h-10 rounded-md object-cover" />}
                    <div>
                      <p className="text-sm font-medium text-foreground">{offer.to_product?.title || "Product"}</p>
                      <p className="text-xs text-muted-foreground">{offer.to_profile?.display_name || offer.to_profile?.username || "User"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[offer.status]}`}>
                      {statusLabels[offer.status]}
                    </span>
                    {offer.status === "pending" && offer.to_user_id === user.id && (
                      <div className="flex gap-1">
                        <Button size="sm" onClick={() => updateOfferStatus(offer.id, "accepted")} className="h-8 w-8 p-0 bg-emerald-600 hover:bg-emerald-700 text-primary-foreground">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => updateOfferStatus(offer.id, "rejected")} className="h-8 w-8 p-0">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                {offer.message && <p className="text-xs text-muted-foreground mt-3 italic">"{offer.message}"</p>}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersPage;
