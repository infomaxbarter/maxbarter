import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Home, ShoppingBag, Users, BarChart3, User, LogOut, Info, Sun, Moon, Globe, Shield, Heart, ArrowLeftRight, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n, Language } from "@/contexts/I18nContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

const langFlags: Record<Language, string> = { tr: "🇹🇷", en: "🇬🇧", es: "🇪🇸" };
const langNames: Record<Language, string> = { tr: "Türkçe", en: "English", es: "Español" };

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { t, language, setLanguage } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin", user?.id],
    queryFn: async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: user!.id, _role: "admin" as any });
      return data as boolean;
    },
    enabled: !!user,
  });

  const isAuthPage = location.pathname === "/" || location.pathname === "/register";
  if (isAuthPage) return null;

  const navItems = [
    { path: "/home", label: t("nav.home"), icon: Home },
    { path: "/productos", label: t("nav.products"), icon: ShoppingBag },
    { path: "/ofertas", label: t("nav.offers"), icon: ShoppingBag },
    { path: "/exchange", label: t("nav.exchange"), icon: ArrowLeftRight },
    { path: "/usuarios", label: t("nav.users"), icon: Users },
    { path: "/stats", label: t("nav.stats"), icon: BarChart3 },
    { path: "/about", label: t("nav.about"), icon: Info },
    { path: "/community", label: t("nav.community"), icon: Heart },
    { path: "/map", label: t("nav.map"), icon: MapPin },
    ...(isAdmin ? [{ path: "/admin", label: t("nav.admin"), icon: Shield }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/home" className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold text-gradient">MaxBarter</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-1">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title={theme === "dark" ? t("theme.light") : t("theme.dark")}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <span>{langFlags[language]}</span>
              <Globe className="w-3.5 h-3.5" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 glass-card rounded-lg border border-border/50 py-1 min-w-[140px] shadow-lg z-50">
                {(Object.keys(langFlags) as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang); setLangOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                      language === lang ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <span>{langFlags[lang]}</span>
                    {langNames[lang]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <>
              <Link
                to="/perfil"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <User className="w-4 h-4" />
                {t("nav.profile")}
              </Link>
              <button
                onClick={async () => { await signOut(); navigate("/"); }}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-destructive hover:bg-secondary transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <User className="w-4 h-4" />
              {t("login.button")}
            </Link>
          )}
        </div>

        <div className="flex md:hidden items-center gap-1">
          <button onClick={toggleTheme} className="p-2 text-muted-foreground hover:text-foreground">
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-muted-foreground hover:text-foreground">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden glass-card border-t border-border/50"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="flex gap-1 pt-2 border-t border-border/50">
                {(Object.keys(langFlags) as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang); setMobileOpen(false); }}
                    className={`flex-1 py-2 rounded-md text-center text-sm transition-colors ${
                      language === lang ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {langFlags[lang]} {langNames[lang]}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
