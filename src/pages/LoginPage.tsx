import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n, Language } from "@/contexts/I18nContext";
import barterExchange from "@/assets/barter-exchange.png";

const langFlags: Record<Language, string> = { tr: "🇹🇷", en: "🇬🇧", es: "🇪🇸" };

const LoginPage = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ backgroundImage: "url(/images/hero-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-background/60" />

      {/* Language selector on login */}
      <div className="absolute top-4 right-4 z-20 flex gap-1">
        {(Object.keys(langFlags) as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-2.5 py-1.5 rounded-md text-sm transition-colors ${
              language === lang ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground glass-card"
            }`}
          >
            {langFlags[lang]}
          </button>
        ))}
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-24 max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <h1 className="font-display font-bold text-6xl sm:text-7xl lg:text-8xl text-primary leading-none">
            {t("login.welcome")}
          </h1>
          <p className="text-xl sm:text-2xl text-foreground/80 mt-3 font-body">
            {t("login.subtitle")}
          </p>
          <motion.img
            src={barterExchange}
            alt="Barter exchange"
            className="w-64 lg:w-80 mx-auto lg:mx-0 mt-8 drop-shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="glass-card rounded-2xl p-8 glow-border">
            <div className="flex items-center gap-3 justify-center mb-8">
              <div className="h-px flex-1 bg-border" />
              <h2 className="font-display text-2xl font-bold text-foreground tracking-wider">{t("login.title")}</h2>
              <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t("login.username")}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t("login.username")}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-secondary border-border focus:border-primary focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t("login.password")}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("login.password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-secondary border-border focus:border-primary focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold text-lg tracking-wider h-12">
                {t("login.button")}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {t("login.noAccount")}{" "}
                <Link to="/register" className="text-primary hover:underline font-medium">{t("login.register")}</Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
