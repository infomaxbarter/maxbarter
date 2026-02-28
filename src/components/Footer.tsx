import { Link, useLocation } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const location = useLocation();
  const { t } = useI18n();

  if (location.pathname === "/" || location.pathname === "/register") return null;

  return (
    <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm mt-12">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-display font-bold text-gradient mb-3">MaxBarter</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("footer.description")}</p>
          </div>
          <div>
            <h4 className="font-display font-bold text-foreground mb-3">{t("footer.links")}</h4>
            <div className="space-y-2">
              <Link to="/home" className="block text-sm text-muted-foreground hover:text-primary transition-colors">{t("nav.home")}</Link>
              <Link to="/products" className="block text-sm text-muted-foreground hover:text-primary transition-colors">{t("nav.products")}</Link>
              <Link to="/offers" className="block text-sm text-muted-foreground hover:text-primary transition-colors">{t("nav.offers")}</Link>
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">{t("nav.about")}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display font-bold text-foreground mb-3">{t("footer.contact")}</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> info@maxbarter.com</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +34 900 123 456</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Madrid, España</p>
            </div>
          </div>
        </div>
        <div className="border-t border-border/50 mt-8 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} MaxBarter. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
