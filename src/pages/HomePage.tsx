import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Users as UsersIcon, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";

const mockProducts = [
  {
    title: "Guitarra Acústica Yamaha",
    description: "Guitarra en perfecto estado, apenas usada. Incluye funda.",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=300&fit=crop",
    category: "Música",
    location: "Madrid",
    user: "Carlos M.",
  },
  {
    title: "Cámara Canon EOS",
    description: "Cámara réflex profesional con objetivo 18-55mm.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop",
    category: "Electrónica",
    location: "Barcelona",
    user: "Ana R.",
  },
  {
    title: "Bicicleta de Montaña",
    description: "Mountain bike aluminio, 21 velocidades, rodado 29.",
    image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&h=300&fit=crop",
    category: "Deporte",
    location: "Valencia",
    user: "Pedro L.",
  },
  {
    title: "MacBook Pro 2020",
    description: "Portátil Apple en excelente estado, 256GB SSD, 8GB RAM.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    category: "Electrónica",
    location: "Sevilla",
    user: "Laura G.",
  },
  {
    title: "Colección de Libros",
    description: "Pack de 15 novelas de ciencia ficción en perfecto estado.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop",
    category: "Libros",
    location: "Bilbao",
    user: "Marta S.",
  },
  {
    title: "Zapatillas Nike Air Max",
    description: "Zapatillas deportivas talla 42, usadas solo 2 veces.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    category: "Ropa",
    location: "Málaga",
    user: "David E.",
  },
  {
    title: "Consola PlayStation 4",
    description: "PS4 Slim 1TB con 2 mandos y 5 juegos incluidos.",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop",
    category: "Gaming",
    location: "Zaragoza",
    user: "Javier P.",
  },
  {
    title: "Set de Cocina Premium",
    description: "Juego de ollas y sartenes de acero inoxidable, 12 piezas.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    category: "Hogar",
    location: "Alicante",
    user: "Isabel F.",
  },
];

const categories = ["Todos", "Electrónica", "Música", "Deporte", "Libros", "Ropa", "Gaming", "Hogar"];

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredProducts = mockProducts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === "Todos" || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-8"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Filtrar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-secondary border-border focus:border-primary"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-foreground gap-2">
            <UsersIcon className="w-4 h-4" />
            Usuarios
          </Button>
        </motion.div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No hay productos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
