import { motion } from "framer-motion";
import { Search, MapPin, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const mockUsers = [
  { name: "Carlos M.", location: "Madrid", email: "carlos@mail.com", products: 8, rating: 4.5 },
  { name: "Ana R.", location: "Barcelona", email: "ana@mail.com", products: 12, rating: 4.8 },
  { name: "Pedro L.", location: "Valencia", email: "pedro@mail.com", products: 5, rating: 3.9 },
  { name: "Laura G.", location: "Sevilla", email: "laura@mail.com", products: 15, rating: 4.7 },
  { name: "Marta S.", location: "Bilbao", email: "marta@mail.com", products: 3, rating: 4.2 },
  { name: "David E.", location: "Málaga", email: "david@mail.com", products: 7, rating: 4.0 },
];

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const filtered = mockUsers.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-4">Usuarios</h1>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary border-border focus:border-primary"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((user, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl p-5 hover:glow-border transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="font-display font-bold text-primary text-lg">{user.name[0]}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-foreground">{user.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {user.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <span>{user.products} productos</span>
                <span className="text-primary font-medium">★ {user.rating}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
