import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Package, Wrench, Users } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import MapView from "@/components/MapView";
import { makeProductSlug } from "@/lib/utils";
import { seedProducts, seedProfiles, seedExchangeRequests, withSeedFallback } from "@/lib/seedData";

const MapPage = () => {
  const { t } = useI18n();
  const [filter, setFilter] = useState<"all" | "products" | "services" | "users">("all");

  const { data: dbProducts = [] } = useQuery({
    queryKey: ["map-products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("id, title, description, image_url, latitude, longitude, category").not("latitude", "is", null).not("longitude", "is", null);
      return data || [];
    },
  });

  const { data: dbRequests = [] } = useQuery({
    queryKey: ["map-requests"],
    queryFn: async () => {
      const { data } = await supabase.from("exchange_requests").select("id, title, description, image_url, latitude, longitude, type").not("latitude", "is", null).not("longitude", "is", null);
      return data || [];
    },
  });

  const { data: dbProfiles = [] } = useQuery({
    queryKey: ["map-profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("user_id, username, display_name, avatar_url, latitude, longitude").not("latitude", "is", null).not("longitude", "is", null);
      return data || [];
    },
  });

  const products = withSeedFallback(dbProducts, seedProducts.filter(p => p.latitude) as any);
  const requests = withSeedFallback(dbRequests, seedExchangeRequests.filter(r => r.latitude) as any);
  const profiles = withSeedFallback(dbProfiles, seedProfiles.filter(p => p.latitude) as any);

  const markers = [
    ...(filter === "all" || filter === "products"
      ? products.map((p: any) => ({
          lat: p.latitude, lng: p.longitude, title: p.title,
          description: p.description?.slice(0, 80), type: "product" as const,
          link: `/products/${makeProductSlug(p.title, p.id)}`, imageUrl: p.image_url,
        }))
      : []),
    ...(filter === "all" || filter === "services"
      ? requests.filter((r: any) => r.type === "service").map((r: any) => ({
          lat: r.latitude, lng: r.longitude, title: r.title,
          description: r.description?.slice(0, 80), type: "service" as const,
          link: `/exchange`, imageUrl: r.image_url,
        }))
      : []),
    ...(filter === "all" || filter === "users"
      ? profiles.map((p: any) => ({
          lat: p.latitude, lng: p.longitude, title: p.display_name || p.username,
          type: "user" as const, link: `/users/${p.username}`, imageUrl: p.avatar_url,
        }))
      : []),
  ];

  const filters = [
    { key: "all" as const, label: t("home.all"), icon: MapPin },
    { key: "products" as const, label: t("nav.products"), icon: Package },
    { key: "services" as const, label: t("exchange.service"), icon: Wrench },
    { key: "users" as const, label: t("nav.users"), icon: Users },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="font-display text-3xl font-bold mb-2">
            <MapPin className="w-7 h-7 inline mr-2 text-primary" />{t("map.title")}
          </h1>
          <p className="text-muted-foreground text-sm">{t("map.subtitle")}</p>
        </motion.div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {filters.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === f.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}>
              <f.icon className="w-3.5 h-3.5" /> {f.label}
            </button>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <MapView markers={markers} height="calc(100vh - 250px)" className="shadow-lg" />
        </motion.div>

        <div className="flex gap-6 mt-4 justify-center text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500" /> {t("nav.products")}</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> {t("exchange.service")}</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500" /> {t("nav.users")}</span>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
