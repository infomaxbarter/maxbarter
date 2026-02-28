import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Users, ShoppingBag, Handshake, AlertTriangle,
  Crown, UserCheck, User, Trash2, Eye, Search, ChevronDown,
  Plus, X, Edit2, Check, Ban, RotateCcw, ArrowLeftRight, Clock, Play, Pause
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link, Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type AppRole = "admin" | "moderator" | "user";
type OfferStatus = "pending" | "accepted" | "rejected" | "cancelled";
type ProductCategory = "electronics" | "music" | "sports" | "books" | "clothing" | "gaming" | "home" | "other";
type RequestStatus = "pending" | "active" | "matched" | "completed" | "cancelled" | "coming_soon";

// ─── Modal wrapper ─────────────────────────────
const Modal = ({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card rounded-2xl border border-border/50 w-full max-w-lg max-h-[85vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between p-6 border-b border-border/30">
            <h2 className="font-display text-lg font-bold">{title}</h2>
            <button onClick={onClose} className="p-1 hover:text-destructive transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

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

const SelectField = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-muted-foreground">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg border border-border/50 bg-secondary/30 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary">
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "products" | "offers" | "requests">("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [editProduct, setEditProduct] = useState<any>(null);
  const [editProfile, setEditProfile] = useState<any>(null);
  const [editOffer, setEditOffer] = useState<any>(null);
  const [editRequest, setEditRequest] = useState<any>(null);
  const [newProduct, setNewProduct] = useState(false);
  const [newProductData, setNewProductData] = useState({ title: "", description: "", category: "other" as ProductCategory, location: "", image_url: "", latitude: "", longitude: "" });

  // Check admin
  const { data: isAdmin, isLoading: checkingAdmin } = useQuery({
    queryKey: ["isAdmin", user?.id],
    queryFn: async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: user!.id, _role: "admin" as AppRole });
      return data as boolean;
    },
    enabled: !!user,
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      return data || [];
    },
    enabled: isAdmin === true,
  });

  const { data: userRoles = [] } = useQuery({
    queryKey: ["admin-user-roles"],
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("*");
      return data || [];
    },
    enabled: isAdmin === true,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      return data || [];
    },
    enabled: isAdmin === true,
  });

  const { data: offers = [] } = useQuery({
    queryKey: ["admin-offers"],
    queryFn: async () => {
      const { data } = await supabase.from("offers").select("*").order("created_at", { ascending: false });
      return data || [];
    },
    enabled: isAdmin === true,
  });

  // Exchange requests
  const { data: exchangeRequests = [] } = useQuery({
    queryKey: ["admin-exchange-requests"],
    queryFn: async () => {
      const { data } = await supabase.from("exchange_requests").select("*").order("created_at", { ascending: false });
      return data || [];
    },
    enabled: isAdmin === true,
  });

  // ─── Mutations ─────────────────────────────
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
    queryClient.invalidateQueries({ queryKey: ["admin-user-roles"] });
    queryClient.invalidateQueries({ queryKey: ["admin-exchange-requests"] });
  };

  const roleMutation = useMutation({
    mutationFn: async ({ userId, role, action }: { userId: string; role: AppRole; action: "add" | "remove" }) => {
      if (action === "add") {
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role } as any);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
        if (error) throw error;
      }
    },
    onSuccess: () => { invalidateAll(); toast({ title: t("admin.roleUpdated") }); },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateProductMutation = useMutation({
    mutationFn: async (p: any) => {
      const { error } = await supabase.from("products").update({
        title: p.title, description: p.description, category: p.category,
        location: p.location, is_available: p.is_available,
        image_url: p.image_url || null,
        latitude: p.latitude ? parseFloat(p.latitude) : null,
        longitude: p.longitude ? parseFloat(p.longitude) : null,
      }).eq("id", p.id);
      if (error) throw error;
    },
    onSuccess: () => { invalidateAll(); setEditProduct(null); toast({ title: t("admin.productUpdated") }); },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const createProductMutation = useMutation({
    mutationFn: async (p: typeof newProductData) => {
      const { error } = await supabase.from("products").insert({
        title: p.title, description: p.description, category: p.category,
        location: p.location, user_id: user!.id,
        image_url: p.image_url || null,
        latitude: p.latitude ? parseFloat(p.latitude) : null,
        longitude: p.longitude ? parseFloat(p.longitude) : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateAll(); setNewProduct(false);
      setNewProductData({ title: "", description: "", category: "other", location: "", image_url: "", latitude: "", longitude: "" });
      toast({ title: t("admin.productCreated") });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidateAll(); toast({ title: t("admin.productDeleted") }); },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (p: any) => {
      const { error } = await supabase.from("profiles").update({
        display_name: p.display_name, username: p.username,
        bio: p.bio, location: p.location, phone: p.phone,
        rating: p.rating, total_exchanges: p.total_exchanges,
        avatar_url: p.avatar_url || null,
        latitude: p.latitude ? parseFloat(p.latitude) : null,
        longitude: p.longitude ? parseFloat(p.longitude) : null,
      }).eq("id", p.id);
      if (error) throw error;
    },
    onSuccess: () => { invalidateAll(); setEditProfile(null); toast({ title: t("admin.profileUpdated") }); },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateOfferMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OfferStatus }) => {
      const { error } = await supabase.from("offers").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidateAll(); setEditOffer(null); toast({ title: t("admin.offerUpdated") }); },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteOfferMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("offers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidateAll(); toast({ title: t("admin.offerDeleted") }); },
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase.from("exchange_requests").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidateAll(); toast({ title: t("admin.requestUpdated") }); },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteRequestMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("exchange_requests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidateAll(); toast({ title: t("admin.requestDeleted") }); },
  });

  if (checkingAdmin) {
    return <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
    </div>;
  }

  if (!isAdmin) return <Navigate to="/home" replace />;

  const getRolesForUser = (userId: string) =>
    userRoles.filter((r: any) => r.user_id === userId).map((r: any) => r.role as AppRole);

  const roleIcon = (role: AppRole) => {
    if (role === "admin") return <Crown className="w-3 h-3" />;
    if (role === "moderator") return <UserCheck className="w-3 h-3" />;
    return <User className="w-3 h-3" />;
  };

  const roleColor = (role: AppRole) => {
    if (role === "admin") return "bg-destructive/15 text-destructive border-destructive/30";
    if (role === "moderator") return "bg-primary/15 text-primary border-primary/30";
    return "bg-muted text-muted-foreground border-border";
  };

  const filteredProfiles = profiles.filter((p: any) =>
    p.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories: ProductCategory[] = ["electronics", "music", "sports", "books", "clothing", "gaming", "home", "other"];
  const catOptions = categories.map((c) => ({ value: c, label: t(`cat.${c}`) || c }));

  const stats = [
    { label: t("admin.totalUsers"), value: profiles.length, icon: Users, color: "text-blue-400" },
    { label: t("admin.totalProducts"), value: products.length, icon: ShoppingBag, color: "text-green-400" },
    { label: t("admin.totalOffers"), value: offers.length, icon: Handshake, color: "text-primary" },
    { label: t("admin.pendingOffers"), value: offers.filter((o: any) => o.status === "pending").length, icon: AlertTriangle, color: "text-yellow-400" },
    { label: t("admin.totalRequests"), value: exchangeRequests.length, icon: ArrowLeftRight, color: "text-purple-400" },
    { label: t("admin.pendingRequests"), value: exchangeRequests.filter((r: any) => r.status === "pending").length, icon: Clock, color: "text-pink-400" },
  ];

  const tabs = [
    { key: "overview" as const, label: t("admin.overview") },
    { key: "users" as const, label: t("admin.users") },
    { key: "products" as const, label: t("admin.products") },
    { key: "offers" as const, label: t("admin.offers") },
    { key: "requests" as const, label: t("admin.requests") },
  ];

  const getProfileName = (userId: string) => {
    const p = profiles.find((pr: any) => pr.user_id === userId);
    return p ? (p as any).display_name || (p as any).username : userId.slice(0, 8);
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="font-display text-3xl font-bold">{t("admin.title")}</h1>
          </div>
          <p className="text-muted-foreground">{t("admin.subtitle")}</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 glass-card rounded-lg p-1 w-fit">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}>{tab.label}</button>
          ))}
        </div>

        {/* ═══ OVERVIEW ═══ */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    <span className="font-display text-3xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-display text-lg font-bold mb-4">{t("admin.recentUsers")}</h3>
                <div className="space-y-3">
                  {profiles.slice(0, 5).map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary">
                          {(p.username || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{p.display_name || p.username}</p>
                          <p className="text-xs text-muted-foreground">@{p.username}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {getRolesForUser(p.user_id).map((role: AppRole) => (
                          <span key={role} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${roleColor(role)}`}>
                            {roleIcon(role)} {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-display text-lg font-bold mb-4">{t("admin.recentOffers")}</h3>
                <div className="space-y-3">
                  {offers.slice(0, 5).map((o: any) => (
                    <div key={o.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{getProfileName(o.from_user_id)} → {getProfileName(o.to_user_id)}</p>
                        <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                      </div>
                      <Badge variant={o.status === "accepted" ? "default" : o.status === "rejected" ? "destructive" : "secondary"}>
                        {o.status}
                      </Badge>
                    </div>
                  ))}
                  {offers.length === 0 && <p className="text-sm text-muted-foreground">{t("admin.noData")}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ USERS ═══ */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t("admin.searchUsers")}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg glass-card border border-border/50 bg-transparent text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="glass-card rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 text-muted-foreground font-medium">{t("admin.user")}</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">{t("admin.roles")}</th>
                    <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">{t("admin.location")}</th>
                    <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">{t("admin.joined")}</th>
                    <th className="text-right p-4 text-muted-foreground font-medium">{t("admin.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.map((p: any) => {
                    const roles = getRolesForUser(p.user_id);
                    return (
                      <tr key={p.id} className="border-b border-border/20 hover:bg-secondary/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary">
                              {(p.username || "?")[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{p.display_name || p.username}</p>
                              <p className="text-xs text-muted-foreground">@{p.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {roles.map((role: AppRole) => (
                              <span key={role} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${roleColor(role)}`}>
                                {roleIcon(role)} {role}
                                {role !== "user" && p.user_id !== user?.id && (
                                  <button onClick={() => roleMutation.mutate({ userId: p.user_id, role, action: "remove" })}
                                    className="ml-1 hover:text-destructive">×</button>
                                )}
                              </span>
                            ))}
                            {p.user_id !== user?.id && (
                              <RoleDropdown currentRoles={roles} onAdd={(role) => roleMutation.mutate({ userId: p.user_id, role, action: "add" })} />
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">{p.location || "—"}</td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">{new Date(p.created_at).toLocaleDateString()}</td>
                        <td className="p-4 text-right space-x-1">
                          <button onClick={() => setEditProfile({ ...p })} className="p-2 hover:text-primary transition-colors inline-block">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <Link to={`/usuarios/${p.user_id}`} className="p-2 hover:text-primary transition-colors inline-block">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ PRODUCTS ═══ */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">{products.length} {t("admin.products").toLowerCase()}</p>
              <button onClick={() => setNewProduct(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Plus className="w-4 h-4" /> {t("admin.addProduct")}
              </button>
            </div>
            <div className="glass-card rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 text-muted-foreground font-medium">{t("admin.product")}</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">{t("admin.owner")}</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">{t("admin.category")}</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">{t("admin.status")}</th>
                    <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">{t("admin.date")}</th>
                    <th className="text-right p-4 text-muted-foreground font-medium">{t("admin.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p: any) => (
                    <tr key={p.id} className="border-b border-border/20 hover:bg-secondary/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {p.image_url ? (
                            <img src={p.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                          <span className="font-medium">{p.title}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{getProfileName(p.user_id)}</td>
                      <td className="p-4"><Badge variant="secondary">{t(`cat.${p.category}`) || p.category}</Badge></td>
                      <td className="p-4">
                        <Badge variant={p.is_available ? "default" : "secondary"}>
                          {p.is_available ? t("admin.available") : t("admin.unavailable")}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="p-4 text-right space-x-1">
                        <button onClick={() => setEditProduct({ ...p })} className="p-2 hover:text-primary transition-colors inline-block">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <Link to={`/productos/${p.id}`} className="p-2 hover:text-primary transition-colors inline-block">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button onClick={() => { if (confirm(t("admin.confirmDelete"))) deleteProductMutation.mutate(p.id); }}
                          className="p-2 hover:text-destructive transition-colors inline-block">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ OFFERS ═══ */}
        {activeTab === "offers" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{offers.length} {t("admin.offers").toLowerCase()}</p>
            <div className="glass-card rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 text-muted-foreground font-medium">{t("admin.from")}</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">{t("admin.to")}</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">{t("admin.status")}</th>
                    <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">{t("admin.message")}</th>
                    <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">{t("admin.date")}</th>
                    <th className="text-right p-4 text-muted-foreground font-medium">{t("admin.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((o: any) => (
                    <tr key={o.id} className="border-b border-border/20 hover:bg-secondary/30 transition-colors">
                      <td className="p-4 font-medium">{getProfileName(o.from_user_id)}</td>
                      <td className="p-4 font-medium">{getProfileName(o.to_user_id)}</td>
                      <td className="p-4">
                        <Badge variant={o.status === "accepted" ? "default" : o.status === "rejected" ? "destructive" : "secondary"}>
                          {o.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground max-w-xs truncate hidden md:table-cell">{o.message || "—"}</td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">{new Date(o.created_at).toLocaleDateString()}</td>
                      <td className="p-4 text-right space-x-1">
                        {o.status === "pending" && (
                          <>
                            <button onClick={() => updateOfferMutation.mutate({ id: o.id, status: "accepted" })}
                              className="p-2 hover:text-green-400 transition-colors inline-block" title={t("admin.accept")}>
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => updateOfferMutation.mutate({ id: o.id, status: "rejected" })}
                              className="p-2 hover:text-destructive transition-colors inline-block" title={t("admin.reject")}>
                              <Ban className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {o.status !== "pending" && (
                          <button onClick={() => updateOfferMutation.mutate({ id: o.id, status: "pending" })}
                            className="p-2 hover:text-primary transition-colors inline-block" title={t("admin.resetToPending")}>
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => { if (confirm(t("admin.confirmDelete"))) deleteOfferMutation.mutate(o.id); }}
                          className="p-2 hover:text-destructive transition-colors inline-block">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {offers.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">{t("admin.noData")}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ REQUESTS ═══ */}
        {activeTab === "requests" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{exchangeRequests.length} {t("admin.requests").toLowerCase()}</p>
            <div className="glass-card rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 text-muted-foreground font-medium">{t("exchange.requestTitle")}</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">{t("exchange.type")}</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">{t("admin.user")}</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">{t("admin.status")}</th>
                    <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">{t("admin.date")}</th>
                    <th className="text-right p-4 text-muted-foreground font-medium">{t("admin.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {exchangeRequests.map((r: any) => (
                    <tr key={r.id} className="border-b border-border/20 hover:bg-secondary/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{r.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{r.offer_description?.slice(0, 40)}...</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary">{r.type === "product" ? t("exchange.product") : t("exchange.service")}</Badge>
                      </td>
                      <td className="p-4 text-muted-foreground">{r.is_anonymous ? t("exchange.anonymous") : getProfileName(r.user_id)}</td>
                      <td className="p-4">
                        <select value={r.status}
                          onChange={(e) => updateRequestMutation.mutate({ id: r.id, updates: { status: e.target.value } })}
                          className="px-2 py-1 rounded border border-border/50 bg-secondary/30 text-xs text-foreground">
                          {(["pending", "active", "matched", "completed", "cancelled", "coming_soon"] as RequestStatus[]).map((s) => (
                            <option key={s} value={s}>{t(`exchange.status.${s}`)}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">{new Date(r.created_at).toLocaleDateString()}</td>
                      <td className="p-4 text-right space-x-1">
                        <button onClick={() => setEditRequest({ ...r })} className="p-2 hover:text-primary transition-colors inline-block">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {r.status === "pending" && (
                          <button onClick={() => updateRequestMutation.mutate({ id: r.id, updates: { status: "active" } })}
                            className="p-2 hover:text-emerald-400 transition-colors inline-block" title="Activate">
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        {r.status === "active" && (
                          <button onClick={() => updateRequestMutation.mutate({ id: r.id, updates: { status: "pending" } })}
                            className="p-2 hover:text-amber-400 transition-colors inline-block" title="Pause">
                            <Pause className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => { if (confirm(t("admin.confirmDelete"))) deleteRequestMutation.mutate(r.id); }}
                          className="p-2 hover:text-destructive transition-colors inline-block">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {exchangeRequests.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">{t("admin.noData")}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ═══ MODALS ═══ */}

      {/* Edit Product Modal */}
      <Modal open={!!editProduct} onClose={() => setEditProduct(null)} title={t("admin.editProduct")}>
        {editProduct && (
          <div className="space-y-4">
            <InputField label={t("admin.productTitle")} value={editProduct.title} onChange={(v: string) => setEditProduct({ ...editProduct, title: v })} />
            <InputField label={t("admin.description")} value={editProduct.description || ""} onChange={(v: string) => setEditProduct({ ...editProduct, description: v })} rows={3} />
            <SelectField label={t("admin.category")} value={editProduct.category} onChange={(v) => setEditProduct({ ...editProduct, category: v })} options={catOptions} />
            <InputField label={t("admin.location")} value={editProduct.location || ""} onChange={(v: string) => setEditProduct({ ...editProduct, location: v })} />
            <InputField label={t("admin.imageUrl")} value={editProduct.image_url || ""} onChange={(v: string) => setEditProduct({ ...editProduct, image_url: v })} placeholder="https://..." />
            <div className="grid grid-cols-2 gap-4">
              <InputField label={t("admin.latitude")} type="number" value={editProduct.latitude || ""} onChange={(v: string) => setEditProduct({ ...editProduct, latitude: v })} />
              <InputField label={t("admin.longitude")} type="number" value={editProduct.longitude || ""} onChange={(v: string) => setEditProduct({ ...editProduct, longitude: v })} />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-muted-foreground">{t("admin.available")}</label>
              <button onClick={() => setEditProduct({ ...editProduct, is_available: !editProduct.is_available })}
                className={`w-10 h-6 rounded-full transition-colors ${editProduct.is_available ? "bg-primary" : "bg-muted"}`}>
                <div className={`w-4 h-4 rounded-full bg-primary-foreground mx-1 transition-transform ${editProduct.is_available ? "translate-x-4" : ""}`} />
              </button>
            </div>
            <button onClick={() => updateProductMutation.mutate(editProduct)}
              disabled={updateProductMutation.isPending}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
              {t("admin.save")}
            </button>
          </div>
        )}
      </Modal>

      {/* New Product Modal */}
      <Modal open={newProduct} onClose={() => setNewProduct(false)} title={t("admin.addProduct")}>
        <div className="space-y-4">
          <InputField label={t("admin.productTitle")} value={newProductData.title} onChange={(v: string) => setNewProductData({ ...newProductData, title: v })} />
          <InputField label={t("admin.description")} value={newProductData.description} onChange={(v: string) => setNewProductData({ ...newProductData, description: v })} rows={3} />
          <SelectField label={t("admin.category")} value={newProductData.category} onChange={(v) => setNewProductData({ ...newProductData, category: v as ProductCategory })} options={catOptions} />
          <InputField label={t("admin.location")} value={newProductData.location} onChange={(v: string) => setNewProductData({ ...newProductData, location: v })} />
          <InputField label={t("admin.imageUrl")} value={newProductData.image_url} onChange={(v: string) => setNewProductData({ ...newProductData, image_url: v })} placeholder="https://..." />
          <div className="grid grid-cols-2 gap-4">
            <InputField label={t("admin.latitude")} type="number" value={newProductData.latitude} onChange={(v: string) => setNewProductData({ ...newProductData, latitude: v })} />
            <InputField label={t("admin.longitude")} type="number" value={newProductData.longitude} onChange={(v: string) => setNewProductData({ ...newProductData, longitude: v })} />
          </div>
          <button onClick={() => createProductMutation.mutate(newProductData)}
            disabled={!newProductData.title || createProductMutation.isPending}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
            {t("admin.create")}
          </button>
        </div>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal open={!!editProfile} onClose={() => setEditProfile(null)} title={t("admin.editProfile")}>
        {editProfile && (
          <div className="space-y-4">
            <InputField label={t("admin.username")} value={editProfile.username} onChange={(v: string) => setEditProfile({ ...editProfile, username: v })} />
            <InputField label={t("admin.displayName")} value={editProfile.display_name || ""} onChange={(v: string) => setEditProfile({ ...editProfile, display_name: v })} />
            <InputField label={t("admin.avatarUrl")} value={editProfile.avatar_url || ""} onChange={(v: string) => setEditProfile({ ...editProfile, avatar_url: v })} placeholder="https://..." />
            <InputField label={t("admin.bio")} value={editProfile.bio || ""} onChange={(v: string) => setEditProfile({ ...editProfile, bio: v })} rows={3} />
            <InputField label={t("admin.location")} value={editProfile.location || ""} onChange={(v: string) => setEditProfile({ ...editProfile, location: v })} />
            <InputField label={t("admin.phone")} value={editProfile.phone || ""} onChange={(v: string) => setEditProfile({ ...editProfile, phone: v })} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label={t("admin.rating")} type="number" value={editProfile.rating || 0} onChange={(v: string) => setEditProfile({ ...editProfile, rating: parseFloat(v) || 0 })} />
              <InputField label={t("admin.exchanges")} type="number" value={editProfile.total_exchanges || 0} onChange={(v: string) => setEditProfile({ ...editProfile, total_exchanges: parseInt(v) || 0 })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField label={t("admin.latitude")} type="number" value={editProfile.latitude || ""} onChange={(v: string) => setEditProfile({ ...editProfile, latitude: v })} />
              <InputField label={t("admin.longitude")} type="number" value={editProfile.longitude || ""} onChange={(v: string) => setEditProfile({ ...editProfile, longitude: v })} />
            </div>
            <button onClick={() => updateProfileMutation.mutate(editProfile)}
              disabled={updateProfileMutation.isPending}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
              {t("admin.save")}
            </button>
          </div>
        )}
      </Modal>

      {/* Edit Request Modal */}
      <Modal open={!!editRequest} onClose={() => setEditRequest(null)} title={t("admin.editRequest")}>
        {editRequest && (
          <div className="space-y-4">
            <InputField label={t("exchange.requestTitle")} value={editRequest.title} onChange={(v: string) => setEditRequest({ ...editRequest, title: v })} />
            <InputField label={t("admin.description")} value={editRequest.description || ""} onChange={(v: string) => setEditRequest({ ...editRequest, description: v })} rows={2} />
            <InputField label={t("exchange.whatYouOffer")} value={editRequest.offer_description} onChange={(v: string) => setEditRequest({ ...editRequest, offer_description: v })} rows={2} />
            <InputField label={t("exchange.whatYouWant")} value={editRequest.request_description} onChange={(v: string) => setEditRequest({ ...editRequest, request_description: v })} rows={2} />
            <InputField label={t("admin.imageUrl")} value={editRequest.image_url || ""} onChange={(v: string) => setEditRequest({ ...editRequest, image_url: v })} placeholder="https://..." />
            <InputField label={t("admin.location")} value={editRequest.location || ""} onChange={(v: string) => setEditRequest({ ...editRequest, location: v })} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label={t("admin.latitude")} type="number" value={editRequest.latitude || ""} onChange={(v: string) => setEditRequest({ ...editRequest, latitude: v })} />
              <InputField label={t("admin.longitude")} type="number" value={editRequest.longitude || ""} onChange={(v: string) => setEditRequest({ ...editRequest, longitude: v })} />
            </div>
            <SelectField label={t("admin.status")} value={editRequest.status} onChange={(v) => setEditRequest({ ...editRequest, status: v })}
              options={["pending", "active", "matched", "completed", "cancelled", "coming_soon"].map(s => ({ value: s, label: t(`exchange.status.${s}`) }))} />
            <InputField label={t("admin.adminNotes")} value={editRequest.admin_notes || ""} onChange={(v: string) => setEditRequest({ ...editRequest, admin_notes: v })} rows={2} />
            <InputField label={t("admin.matchUser")} value={editRequest.matched_user_id || ""} onChange={(v: string) => setEditRequest({ ...editRequest, matched_user_id: v || null })} placeholder="User ID" />
            <button onClick={() => {
              const updates: any = {
                title: editRequest.title, description: editRequest.description,
                offer_description: editRequest.offer_description, request_description: editRequest.request_description,
                location: editRequest.location, status: editRequest.status,
                admin_notes: editRequest.admin_notes, matched_user_id: editRequest.matched_user_id,
                image_url: editRequest.image_url || null,
                latitude: editRequest.latitude ? parseFloat(editRequest.latitude) : null,
                longitude: editRequest.longitude ? parseFloat(editRequest.longitude) : null,
              };
              updateRequestMutation.mutate({ id: editRequest.id, updates });
              setEditRequest(null);
            }}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
              {t("admin.save")}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ─── Role Dropdown ─────────────────────────────
const RoleDropdown = ({ currentRoles, onAdd }: { currentRoles: AppRole[]; onAdd: (role: AppRole) => void }) => {
  const [open, setOpen] = useState(false);
  const allRoles: AppRole[] = ["admin", "moderator", "user"];
  const available = allRoles.filter((r) => !currentRoles.includes(r));
  if (available.length === 0) return null;
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
        + <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 glass-card rounded-lg border border-border/50 py-1 min-w-[120px] shadow-lg z-50">
          {available.map((role) => (
            <button key={role} onClick={() => { onAdd(role); setOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary transition-colors capitalize">{role}</button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
