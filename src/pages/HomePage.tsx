import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Users as UsersIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useI18n } from "@/contexts/I18nContext";

const mockProducts = [
  { title: "Guitarra Acústica Yamaha", titleKey: "guitar", description: "Guitarra en perfecto estado, apenas usada. Incluye funda.", image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=300&fit=crop", categoryKey: "cat.music", location: "Madrid", user: "Carlos M." },
  { title: "Cámara Canon EOS", titleKey: "camera", description: "Cámara réflex profesional con objetivo 18-55mm.", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop", categoryKey: "cat.electronics", location: "Barcelona", user: "Ana R." },
  { title: "Bicicleta de Montaña", titleKey: "bike", description: "Mountain bike aluminio, 21 velocidades, rodado 29.", image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&h=300&fit=crop", categoryKey: "cat.sports", location: "Valencia", user: "Pedro L." },
  { title: "MacBook Pro 2020", titleKey: "macbook", description: "Portátil Apple en excelente estado, 256GB SSD, 8GB RAM.", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop", categoryKey: "cat.electronics", location: "Sevilla", user: "Laura G." },
  { title: "Colección de Libros", titleKey: "books", description: "Pack de 15 novelas de ciencia ficción en perfecto estado.", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop", categoryKey: "cat.books", location: "Bilbao", user: "Marta S." },
  { title: "Zapatillas Nike Air Max", titleKey: "shoes", description: "Zapatillas deportivas talla 42, usadas solo 2 veces.", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop", categoryKey: "cat.clothing", location: "Málaga", user: "David E." },
  { title: "Consola PlayStation 4", titleKey: "ps4", description: "PS4 Slim 1TB con 2 mandos y 5 juegos incluidos.", image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop", categoryKey: "cat.gaming", location: "Zaragoza", user: "Javier P." },
  { title: "Set de Cocina Premium", titleKey: "kitchen", description: "Juego de ollas y sartenes de acero inoxidable, 12 piezas.", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop", categoryKey: "cat.home", location: "Alicante", user: "Isabel F." },
];

const categoryKeys = ["home.all", "cat.electronics", "cat.music", "cat.sports", "cat.books", "cat.clothing", "cat.gaming", "cat.home"];

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("home.all");
  const { t } = useI18n();

  const filteredProducts = mockProducts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === "home.all" || p.categoryKey === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-8"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("home.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-secondary border-border focus:border-primary"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categoryKeys.map((catKey) => (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === catKey
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                {t(catKey)}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-foreground gap-2">
            <UsersIcon className="w-4 h-4" />
            {t("home.users")}
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <ProductCard
                title={product.title}
                description={product.description}
                image={product.image}
                category={t(product.categoryKey)}
                location={product.location}
                user={product.user}
              />
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">{t("home.noProducts")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
