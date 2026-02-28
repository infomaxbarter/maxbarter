import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ArrowLeftRight, Package, Wrench, MapPin, Clock, Eye, MessageCircle, Send } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import LocationPicker from "@/components/LocationPicker";
import { seedExchangeRequests, seedProposals, withSeedFallback } from "@/lib/seedData";

type RequestType = "product" | "service";
type RequestStatus = "pending" | "active" | "matched" | "completed" | "cancelled" | "coming_soon";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  matched: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  completed: "bg-primary/15 text-primary border-primary/30",
  cancelled: "bg-muted text-muted-foreground border-border",
  coming_soon: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

const ExchangeRequestsPage = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [showProposal, setShowProposal] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "mine">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "product" | "service">("all");

  // Form state
  const [form, setForm] = useState({
    title: "", description: "", type: "product" as RequestType, category: "other",
    offer_description: "", request_description: "", location: "", is_anonymous: false,
    latitude: null as number | null, longitude: null as number | null,
  });
  const [proposalMsg, setProposalMsg] = useState("");
  const [proposalAnon, setProposalAnon] = useState(false);

  const { data: dbRequests = [], isLoading } = useQuery({
    queryKey: ["exchange-requests", filter, typeFilter],
    queryFn: async () => {
      let query = supabase.from("exchange_requests").select("*").order("created_at", { ascending: false });
      if (filter === "mine" && user) query = query.eq("user_id", user.id);
      if (typeFilter !== "all") query = query.eq("type", typeFilter);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const requests = withSeedFallback(dbRequests, seedExchangeRequests as any);

  const { data: dbProposalsData = [] } = useQuery({
    queryKey: ["exchange-proposals"],
    queryFn: async () => {
      const { data } = await supabase.from("exchange_proposals").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const proposals = withSeedFallback(dbProposalsData, seedProposals as any);

  const { data: profiles = [] } = useQuery({
    queryKey: ["profiles-for-requests"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("user_id, username, display_name");
      return data || [];
    },
  });

  const getProfileName = (userId: string | null) => {
    if (!userId) return t("exchange.anonymous");
    const p = profiles.find((pr: any) => pr.user_id === userId);
    return p ? ((p as any).display_name || (p as any).username) : t("exchange.anonymous");
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("exchange_requests").insert({
        ...form,
        user_id: form.is_anonymous ? null : user?.id,
        latitude: form.latitude,
        longitude: form.longitude,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchange-requests"] });
      setShowCreate(false);
      setForm({ title: "", description: "", type: "product", category: "other", offer_description: "", request_description: "", location: "", is_anonymous: false, latitude: null, longitude: null });
      toast({ title: t("exchange.created") });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const proposalMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase.from("exchange_proposals").insert({
        request_id: requestId,
        user_id: proposalAnon ? null : user?.id,
        is_anonymous: proposalAnon,
        message: proposalMsg,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchange-proposals"] });
      setShowProposal(null);
      setProposalMsg("");
      setProposalAnon(false);
      toast({ title: t("exchange.proposalSent") });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const categories = ["electronics", "music", "sports", "books", "clothing", "gaming", "home", "other"];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">{t("exchange.title")}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t("exchange.subtitle")}</p>
          </div>
          <button onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> {t("exchange.create")}
          </button>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="glass-card rounded-lg p-1 flex gap-1">
            {(["all", "mine"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {f === "all" ? t("exchange.allRequests") : t("exchange.myRequests")}
              </button>
            ))}
          </div>
          <div className="glass-card rounded-lg p-1 flex gap-1">
            {(["all", "product", "service"] as const).map((f) => (
              <button key={f} onClick={() => setTypeFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${typeFilter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {f === "product" && <Package className="w-3 h-3" />}
                {f === "service" && <Wrench className="w-3 h-3" />}
                {f === "all" ? t("home.all") : f === "product" ? t("exchange.product") : t("exchange.service")}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        {isLoading ? (
          <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="glass-card rounded-xl h-32 animate-pulse" />)}</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20">
            <ArrowLeftRight className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t("exchange.noRequests")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req: any, i: number) => {
              const reqProposals = proposals.filter((p: any) => p.request_id === req.id);
              return (
                <motion.div key={req.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-xl p-5 hover:glow-border transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display text-lg font-bold">{req.title}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${statusStyles[req.status]}`}>
                          {t(`exchange.status.${req.status}`)}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${req.type === "product" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}`}>
                          {req.type === "product" ? <Package className="w-3 h-3" /> : <Wrench className="w-3 h-3" />}
                          {req.type === "product" ? t("exchange.product") : t("exchange.service")}
                        </span>
                      </div>

                      {req.description && <p className="text-sm text-muted-foreground">{req.description}</p>}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-secondary/30 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1 font-medium">{t("exchange.offering")}</p>
                          <p className="text-sm">{req.offer_description}</p>
                        </div>
                        <div className="bg-secondary/30 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1 font-medium">{t("exchange.requesting")}</p>
                          <p className="text-sm">{req.request_description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{req.is_anonymous ? t("exchange.anonymous") : getProfileName(req.user_id)}</span>
                        {req.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {req.location}</span>}
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(req.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {reqProposals.length} {t("exchange.proposals")}</span>
                      </div>
                    </div>

                    <button onClick={() => setShowProposal(req.id)}
                      className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 transition-colors">
                      <Send className="w-4 h-4" /> {t("exchange.respond")}
                    </button>
                  </div>

                  {/* Show proposals */}
                  {reqProposals.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/30 space-y-2">
                      {reqProposals.slice(0, 3).map((p: any) => (
                        <div key={p.id} className="flex items-start gap-3 text-sm">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">
                            {p.is_anonymous ? "?" : getProfileName(p.user_id)?.[0] || "?"}
                          </div>
                          <div>
                            <p className="text-muted-foreground">{p.message}</p>
                            <p className="text-xs text-muted-foreground/60 mt-0.5">
                              {p.is_anonymous ? t("exchange.anonymous") : getProfileName(p.user_id)} · {new Date(p.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Request Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowCreate(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-2xl border border-border/50 w-full max-w-lg max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-border/30">
                <h2 className="font-display text-lg font-bold">{t("exchange.createTitle")}</h2>
                <button onClick={() => setShowCreate(false)} className="p-1 hover:text-destructive"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">{t("exchange.type")}</label>
                  <div className="flex gap-2">
                    {(["product", "service"] as const).map((tp) => (
                      <button key={tp} onClick={() => setForm({ ...form, type: tp })}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${form.type === tp ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                        {tp === "product" ? <Package className="w-4 h-4" /> : <Wrench className="w-4 h-4" />}
                        {tp === "product" ? t("exchange.product") : t("exchange.service")}
                      </button>
                    ))}
                  </div>
                </div>

                <InputField label={t("exchange.requestTitle")} value={form.title} onChange={(v: string) => setForm({ ...form, title: v })} />
                <InputField label={t("admin.description")} value={form.description} onChange={(v: string) => setForm({ ...form, description: v })} rows={2} />

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">{t("admin.category")}</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border/50 bg-secondary/30 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                    {categories.map((c) => <option key={c} value={c}>{t(`cat.${c}`) || c}</option>)}
                  </select>
                </div>

                <InputField label={t("exchange.whatYouOffer")} value={form.offer_description} onChange={(v: string) => setForm({ ...form, offer_description: v })} rows={2} placeholder={t("exchange.offerPlaceholder")} />
                <InputField label={t("exchange.whatYouWant")} value={form.request_description} onChange={(v: string) => setForm({ ...form, request_description: v })} rows={2} placeholder={t("exchange.requestPlaceholder")} />
                <InputField label={t("admin.location")} value={form.location} onChange={(v: string) => setForm({ ...form, location: v })} />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">{t("admin.location")} (Map)</label>
                  <LocationPicker latitude={form.latitude} longitude={form.longitude} onChange={(lat, lng) => setForm({ ...form, latitude: lat, longitude: lng })} height="200px" />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => setForm({ ...form, is_anonymous: !form.is_anonymous })}
                    className={`w-10 h-6 rounded-full transition-colors ${form.is_anonymous ? "bg-primary" : "bg-muted"}`}>
                    <div className={`w-4 h-4 rounded-full bg-primary-foreground mx-1 mt-1 transition-transform ${form.is_anonymous ? "translate-x-4" : ""}`} />
                  </div>
                  <span className="text-sm text-muted-foreground">{t("exchange.postAnonymously")}</span>
                </label>

                <button onClick={() => createMutation.mutate()}
                  disabled={!form.title || !form.offer_description || !form.request_description || createMutation.isPending}
                  className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {t("exchange.submit")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proposal Modal */}
      <AnimatePresence>
        {showProposal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowProposal(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-2xl border border-border/50 w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-border/30">
                <h2 className="font-display text-lg font-bold">{t("exchange.sendProposal")}</h2>
                <button onClick={() => setShowProposal(null)} className="p-1 hover:text-destructive"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <InputField label={t("exchange.yourProposal")} value={proposalMsg} onChange={setProposalMsg} rows={4} placeholder={t("exchange.proposalPlaceholder")} />

                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => setProposalAnon(!proposalAnon)}
                    className={`w-10 h-6 rounded-full transition-colors ${proposalAnon ? "bg-primary" : "bg-muted"}`}>
                    <div className={`w-4 h-4 rounded-full bg-primary-foreground mx-1 mt-1 transition-transform ${proposalAnon ? "translate-x-4" : ""}`} />
                  </div>
                  <span className="text-sm text-muted-foreground">{t("exchange.postAnonymously")}</span>
                </label>

                <button onClick={() => proposalMutation.mutate(showProposal)}
                  disabled={!proposalMsg || proposalMutation.isPending}
                  className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                  <Send className="w-4 h-4 inline mr-2" /> {t("exchange.send")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InputField = ({ label, value, onChange, type = "text", placeholder = "", rows }: any) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-muted-foreground">{label}</label>
    {rows ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-border/50 bg-secondary/30 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
    ) : (
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-border/50 bg-secondary/30 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
    )}
  </div>
);

export default ExchangeRequestsPage;
