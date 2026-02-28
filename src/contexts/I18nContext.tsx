import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "tr" | "en" | "es";

const translations: Record<Language, Record<string, string>> = {
  tr: {
    // Navbar
    "nav.home": "Ana Sayfa",
    "nav.products": "Ürünler",
    "nav.offers": "Teklifler",
    "nav.users": "Kullanıcılar",
    "nav.stats": "İstatistikler",
    "nav.about": "Hakkımızda",
    "nav.profile": "Profil",

    // Login
    "login.welcome": "HOŞGELDİN",
    "login.subtitle": "en İYİ takas platformuna",
    "login.title": "GİRİŞ YAP",
    "login.username": "Kullanıcı Adı",
    "login.password": "Şifre",
    "login.button": "GİRİŞ YAP",
    "login.noAccount": "Hesabın yok mu?",
    "login.register": "Kayıt Ol",

    // Register
    "register.title": "KAYIT OL",
    "register.username": "Kullanıcı Adı",
    "register.email": "E-posta",
    "register.password": "Şifre",
    "register.confirmPassword": "Şifreyi Onayla",
    "register.button": "KAYIT OL",
    "register.hasAccount": "Zaten hesabın var mı?",
    "register.login": "Giriş Yap",

    // Home
    "home.search": "Başlığa göre filtrele...",
    "home.all": "Tümü",
    "home.users": "Kullanıcılar",
    "home.noProducts": "Ürün bulunamadı",
    "home.viewDetails": "Detayları gör",

    // About
    "about.title": "Hakkında",
    "about.subtitle": "MaxBarter, çevrimiçi takas alanında lider platformdur. Amacımız, kullanıcılar arasında güvenli, basit ve sürdürülebilir ürün takasını kolaylaştırmaktır.",
    "about.feature1.title": "Doğrudan Takas",
    "about.feature1.desc": "Ürünlerinizi para kullanmadan diğer kullanıcılarla doğrudan takas edin.",
    "about.feature2.title": "Küresel Topluluk",
    "about.feature2.desc": "Tüm ülkelerden insanlarla bağlantı kurun ve ihtiyacınızı bulun.",
    "about.feature3.title": "Döngüsel Ekonomi",
    "about.feature3.desc": "Kullanmadığınız ürünlere yeni bir hayat vererek çevreye katkıda bulunun.",
    "about.feature4.title": "Güven Ağı",
    "about.feature4.desc": "Güvenli takaslar için değerlendirme ve eşleşme sistemi.",
    "about.howTitle": "Nasıl çalışır",
    "about.how1": "Takas etmek istediğiniz ürünleri fotoğraf ve açıklamayla yayınlayın.",
    "about.how2": "Diğer kullanıcıların ürünlerini keşfedin ve kategoriye göre filtreleyin.",
    "about.how3": "Sahibine bir takas teklifi gönderin.",
    "about.how4": "İkiniz de kabul ederseniz takas gerçekleşir!",
    "about.productsTitle": "Binlerce ürün",
    "about.productsDesc": "Elektronikten müziğe, kıyafetten ev eşyalarına kadar. MaxBarter'da takas edilmeye hazır çok çeşitli ürünler bulacaksınız.",
    "about.productsDesc2": "Topluluğumuz her gün büyüyor.",

    // Offers
    "offers.title": "Tekliflerim",
    "offers.pending": "Beklemede",
    "offers.accepted": "Kabul Edildi",
    "offers.rejected": "Reddedildi",

    // Users
    "users.title": "Kullanıcılar",
    "users.search": "Kullanıcı ara...",
    "users.products": "ürün",

    // Stats
    "stats.title": "İstatistikler",
    "stats.totalProducts": "Toplam Ürün",
    "stats.exchanges": "Takaslar",
    "stats.activeUsers": "Aktif Kullanıcılar",
    "stats.todayOffers": "Bugünkü Teklifler",
    "stats.comingSoon": "Detaylı grafikler yakında...",

    // Profile
    "profile.edit": "Düzenle",
    "profile.products": "Ürünler",
    "profile.exchanges": "Takaslar",
    "profile.rating": "Değerlendirme",

    // Footer
    "footer.description": "En iyi çevrimiçi takas platformu. Ürünlerinizi güvenli ve kolay bir şekilde takas edin.",
    "footer.links": "Bağlantılar",
    "footer.contact": "İletişim",
    "footer.rights": "Tüm hakları saklıdır.",

    // Categories
    "cat.electronics": "Elektronik",
    "cat.music": "Müzik",
    "cat.sports": "Spor",
    "cat.books": "Kitaplar",
    "cat.clothing": "Giyim",
    "cat.gaming": "Oyun",
    "cat.home": "Ev",

    // Theme
    "theme.light": "Açık",
    "theme.dark": "Koyu",
  },
  en: {
    "nav.home": "Home",
    "nav.products": "Products",
    "nav.offers": "Offers",
    "nav.users": "Users",
    "nav.stats": "Statistics",
    "nav.about": "About Us",
    "nav.profile": "Profile",

    "login.welcome": "WELCOME",
    "login.subtitle": "to the BEST barter page",
    "login.title": "LOGIN",
    "login.username": "Username",
    "login.password": "Password",
    "login.button": "LOGIN",
    "login.noAccount": "Don't have an account?",
    "login.register": "Register",

    "register.title": "REGISTER",
    "register.username": "Username",
    "register.email": "Email",
    "register.password": "Password",
    "register.confirmPassword": "Confirm Password",
    "register.button": "REGISTER",
    "register.hasAccount": "Already have an account?",
    "register.login": "Log In",

    "home.search": "Filter by title...",
    "home.all": "All",
    "home.users": "Users",
    "home.noProducts": "No products found",
    "home.viewDetails": "View details",

    "about.title": "About",
    "about.subtitle": "MaxBarter is the leading online barter platform. Our goal is to facilitate safe, simple and sustainable product exchange between users.",
    "about.feature1.title": "Direct Exchange",
    "about.feature1.desc": "Exchange your products directly with other users without money.",
    "about.feature2.title": "Global Community",
    "about.feature2.desc": "Connect with people from everywhere and find what you need.",
    "about.feature3.title": "Circular Economy",
    "about.feature3.desc": "Contribute to the environment by giving new life to unused products.",
    "about.feature4.title": "Trust Network",
    "about.feature4.desc": "Rating and matching system for safe exchanges.",
    "about.howTitle": "How it works",
    "about.how1": "Publish the products you want to exchange with photos and description.",
    "about.how2": "Explore other users' products and filter by category or location.",
    "about.how3": "Propose an exchange by sending an offer to the owner.",
    "about.how4": "If both accept, the exchange takes place!",
    "about.productsTitle": "Thousands of products",
    "about.productsDesc": "From electronics and music to clothing and home items. At MaxBarter you'll find a wide variety of products ready to exchange.",
    "about.productsDesc2": "Our community grows every day.",

    "offers.title": "My Offers",
    "offers.pending": "Pending",
    "offers.accepted": "Accepted",
    "offers.rejected": "Rejected",

    "users.title": "Users",
    "users.search": "Search user...",
    "users.products": "products",

    "stats.title": "Statistics",
    "stats.totalProducts": "Total Products",
    "stats.exchanges": "Exchanges",
    "stats.activeUsers": "Active Users",
    "stats.todayOffers": "Today's Offers",
    "stats.comingSoon": "Detailed charts coming soon...",

    "profile.edit": "Edit",
    "profile.products": "Products",
    "profile.exchanges": "Exchanges",
    "profile.rating": "Rating",

    "footer.description": "The best online barter platform. Exchange your products safely and easily.",
    "footer.links": "Links",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",

    "cat.electronics": "Electronics",
    "cat.music": "Music",
    "cat.sports": "Sports",
    "cat.books": "Books",
    "cat.clothing": "Clothing",
    "cat.gaming": "Gaming",
    "cat.home": "Home",

    "theme.light": "Light",
    "theme.dark": "Dark",
  },
  es: {
    "nav.home": "Inicio",
    "nav.products": "Productos",
    "nav.offers": "Ofertas",
    "nav.users": "Usuarios",
    "nav.stats": "Estadísticas",
    "nav.about": "Sobre Nosotros",
    "nav.profile": "Perfil",

    "login.welcome": "BIENVENIDO",
    "login.subtitle": "a la MEJOR página de trueque",
    "login.title": "INICIAR SESIÓN",
    "login.username": "Usuario",
    "login.password": "Contraseña",
    "login.button": "INICIAR SESIÓN",
    "login.noAccount": "¿No tienes cuenta?",
    "login.register": "Regístrate",

    "register.title": "REGISTRO",
    "register.username": "Usuario",
    "register.email": "Correo electrónico",
    "register.password": "Contraseña",
    "register.confirmPassword": "Confirmar Contraseña",
    "register.button": "REGISTRARSE",
    "register.hasAccount": "¿Ya tienes cuenta?",
    "register.login": "Iniciar Sesión",

    "home.search": "Filtrar por título...",
    "home.all": "Todos",
    "home.users": "Usuarios",
    "home.noProducts": "No hay productos",
    "home.viewDetails": "Ver detalles",

    "about.title": "Sobre",
    "about.subtitle": "MaxBarter es la plataforma líder de trueque online. Nuestro objetivo es facilitar el intercambio de productos entre usuarios de forma segura, sencilla y sostenible.",
    "about.feature1.title": "Intercambio Directo",
    "about.feature1.desc": "Intercambia tus productos directamente con otros usuarios sin necesidad de dinero.",
    "about.feature2.title": "Comunidad Global",
    "about.feature2.desc": "Conecta con personas de toda España y encuentra lo que necesitas.",
    "about.feature3.title": "Economía Circular",
    "about.feature3.desc": "Contribuye al medio ambiente dando nueva vida a productos que ya no usas.",
    "about.feature4.title": "Red de Confianza",
    "about.feature4.desc": "Sistema de valoraciones y matchs para intercambios seguros.",
    "about.howTitle": "¿Cómo funciona?",
    "about.how1": "Publica los productos que quieras intercambiar con fotos y descripción.",
    "about.how2": "Explora los productos de otros usuarios y filtra por categoría o ubicación.",
    "about.how3": "Propón un intercambio enviando una oferta al propietario.",
    "about.how4": "¡Match! Si ambos aceptáis, el intercambio se realiza.",
    "about.productsTitle": "Miles de productos",
    "about.productsDesc": "Desde electrónica y música hasta ropa y artículos del hogar. En MaxBarter encontrarás una amplia variedad de productos listos para intercambiar.",
    "about.productsDesc2": "Nuestra comunidad crece cada día.",

    "offers.title": "Mis Ofertas",
    "offers.pending": "Pendiente",
    "offers.accepted": "Aceptada",
    "offers.rejected": "Rechazada",

    "users.title": "Usuarios",
    "users.search": "Buscar usuario...",
    "users.products": "productos",

    "stats.title": "Estadísticas",
    "stats.totalProducts": "Total Productos",
    "stats.exchanges": "Intercambios",
    "stats.activeUsers": "Usuarios Activos",
    "stats.todayOffers": "Ofertas Hoy",
    "stats.comingSoon": "Gráficos detallados próximamente...",

    "profile.edit": "Editar",
    "profile.products": "Productos",
    "profile.exchanges": "Intercambios",
    "profile.rating": "Valoración",

    "footer.description": "La mejor plataforma de trueque online. Intercambia tus productos de forma segura y sencilla.",
    "footer.links": "Enlaces",
    "footer.contact": "Contacto",
    "footer.rights": "Todos los derechos reservados.",

    "cat.electronics": "Electrónica",
    "cat.music": "Música",
    "cat.sports": "Deporte",
    "cat.books": "Libros",
    "cat.clothing": "Ropa",
    "cat.gaming": "Gaming",
    "cat.home": "Hogar",

    "theme.light": "Claro",
    "theme.dark": "Oscuro",
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: "tr",
  setLanguage: () => {},
  t: (key) => key,
});

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("maxbarter-lang");
    return (saved as Language) || "tr";
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("maxbarter-lang", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
