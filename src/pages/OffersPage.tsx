import { motion } from "framer-motion";
import { ArrowLeftRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";

const mockOffers = [
  {
    from: { user: "Carlos M.", product: "Guitarra Acústica", image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=200&h=150&fit=crop" },
    to: { user: "You", product: "MacBook Pro 2020", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=150&fit=crop" },
    status: "pending",
  },
  {
    from: { user: "Ana R.", product: "Cámara Canon EOS", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=150&fit=crop" },
    to: { user: "You", product: "PlayStation 4", image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&h=150&fit=crop" },
    status: "accepted",
  },
  {
    from: { user: "Pedro L.", product: "Bicicleta", image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=200&h=150&fit=crop" },
    to: { user: "You", product: "Set de Cocina", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=150&fit=crop" },
    status: "rejected",
  },
];

const OffersPage = () => {
  const { t } = useI18n();

  const statusStyles: Record<string, string> = {
    pending: "bg-amber-500/20 text-amber-400",
    accepted: "bg-emerald-500/20 text-emerald-400",
    rejected: "bg-destructive/20 text-destructive",
  };

  const statusLabels: Record<string, string> = {
    pending: t("offers.pending"),
    accepted: t("offers.accepted"),
    rejected: t("offers.rejected"),
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-3xl font-bold mb-8">
          {t("offers.title")}
        </motion.h1>

        <div className="space-y-4">
          {mockOffers.map((offer, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                  <img src={offer.from.image} alt="" className="w-16 h-12 rounded-md object-cover" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{offer.from.product}</p>
                    <p className="text-xs text-muted-foreground">{offer.from.user}</p>
                  </div>
                </div>

                <ArrowLeftRight className="w-5 h-5 text-primary shrink-0" />

                <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                  <img src={offer.to.image} alt="" className="w-16 h-12 rounded-md object-cover" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{offer.to.product}</p>
                    <p className="text-xs text-muted-foreground">{offer.to.user}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[offer.status]}`}>
                    {statusLabels[offer.status]}
                  </span>
                  {offer.status === "pending" && (
                    <div className="flex gap-1">
                      <Button size="sm" className="h-8 w-8 p-0 bg-emerald-600 hover:bg-emerald-700 text-primary-foreground">
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" className="h-8 w-8 p-0">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OffersPage;
