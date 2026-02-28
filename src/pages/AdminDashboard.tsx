import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { motion } from "framer-motion";
import {
  Shield, Users, ShoppingBag, Handshake, AlertTriangle,
  Crown, UserCheck, User, Trash2, Eye, Search, ChevronDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link, Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type AppRole = "admin" | "moderator" | "user";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "products" | "offers">("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // Check if current user is admin
  const { data: isAdmin, isLoading: checkingAdmin } = useQuery({
    queryKey: ["isAdmin", user?.id],
    queryFn: async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: user!.id, _role: "admin" as AppRole });
      return data as boolean;
    },
    enabled: !!user,
  });

  // All profiles
  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      return data || [];
    },
    enabled: isAdmin === true,
  });

  // All user roles
  const { data: userRoles = [] } = useQuery({
    queryKey: ["admin-user-roles"],
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("*");
      return data || [];
    },
    enabled: isAdmin === true,
  });

  // All products
  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      return data || [];
    },
    enabled: isAdmin === true,
  });

  // All offers
  const { data: offers = [] } = useQuery({
    queryKey: ["admin-offers"],
    queryFn: async () => {
      const { data } = await supabase.from("offers").select("*").order("created_at", { ascending: false });
      return data || [];
    },
    enabled: isAdmin === true,
  });

  // Role mutation
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user-roles"] });
      toast({ title: t("admin.roleUpdated") });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  // Delete product
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: t("admin.productDeleted") });
    },
  });

  if (checkingAdmin) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
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

  const stats = [
    { label: t("admin.totalUsers"), value: profiles.length, icon: Users, color: "text-blue-400" },
    { label: t("admin.totalProducts"), value: products.length, icon: ShoppingBag, color: "text-green-400" },
    { label: t("admin.totalOffers"), value: offers.length, icon: Handshake, color: "text-primary" },
    { label: t("admin.pendingOffers"), value: offers.filter((o: any) => o.status === "pending").length, icon: AlertTriangle, color: "text-yellow-400" },
  ];

  const tabs = [
    { key: "overview", label: t("admin.overview") },
    { key: "users", label: t("admin.users") },
    { key: "products", label: t("admin.products") },
    { key: "offers", label: t("admin.offers") },
  ] as const;

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
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    <span className="font-display text-3xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent activity */}
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
                        <p className="text-sm font-medium">{o.id.slice(0, 8)}...</p>
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

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("admin.searchUsers")}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg glass-card border border-border/50 bg-transparent text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="glass-card rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 text-muted-foreground font-medium">{t("admin.user")}</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">{t("admin.roles")}</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">{t("admin.joined")}</th>
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
                                  <button
                                    onClick={() => roleMutation.mutate({ userId: p.user_id, role, action: "remove" })}
                                    className="ml-1 hover:text-destructive"
                                  >×</button>
                                )}
                              </span>
                            ))}
                            {/* Add role dropdown */}
                            {p.user_id !== user?.id && (
                              <RoleDropdown
                                currentRoles={roles}
                                onAdd={(role) => roleMutation.mutate({ userId: p.user_id, role, action: "add" })}
                              />
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(p.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
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

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 text-muted-foreground font-medium">{t("admin.product")}</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">{t("admin.category")}</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">{t("admin.status")}</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">{t("admin.date")}</th>
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
                    <td className="p-4">
                      <Badge variant="secondary">{t(`cat.${p.category}`) || p.category}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={p.is_available ? "default" : "secondary"}>
                        {p.is_available ? t("admin.available") : t("admin.unavailable")}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-right space-x-1">
                      <Link to={`/productos/${p.id}`} className="p-2 hover:text-primary transition-colors inline-block">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => deleteProductMutation.mutate(p.id)}
                        className="p-2 hover:text-destructive transition-colors inline-block"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === "offers" && (
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 text-muted-foreground font-medium">ID</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">{t("admin.status")}</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">{t("admin.message")}</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">{t("admin.date")}</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((o: any) => (
                  <tr key={o.id} className="border-b border-border/20 hover:bg-secondary/30 transition-colors">
                    <td className="p-4 font-mono text-xs">{o.id.slice(0, 12)}...</td>
                    <td className="p-4">
                      <Badge variant={o.status === "accepted" ? "default" : o.status === "rejected" ? "destructive" : "secondary"}>
                        {o.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground max-w-xs truncate">{o.message || "—"}</td>
                    <td className="p-4 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {offers.length === 0 && (
                  <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">{t("admin.noData")}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Small dropdown to add roles
const RoleDropdown = ({ currentRoles, onAdd }: { currentRoles: AppRole[]; onAdd: (role: AppRole) => void }) => {
  const [open, setOpen] = useState(false);
  const allRoles: AppRole[] = ["admin", "moderator", "user"];
  const available = allRoles.filter((r) => !currentRoles.includes(r));

  if (available.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
      >
        + <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 glass-card rounded-lg border border-border/50 py-1 min-w-[120px] shadow-lg z-50">
          {available.map((role) => (
            <button
              key={role}
              onClick={() => { onAdd(role); setOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary transition-colors capitalize"
            >
              {role}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
