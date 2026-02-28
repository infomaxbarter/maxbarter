import { motion } from "framer-motion";
import { User, MapPin, Mail, Edit, Package, Handshake, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-12 h-12 text-primary" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="font-display text-3xl font-bold text-foreground">Usuario Demo</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Madrid, España</span>
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> demo@maxbarter.com</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= 4 ? "text-primary fill-primary" : "text-muted-foreground"}`} />
                ))}
                <span className="text-sm text-muted-foreground ml-1">(4.0)</span>
              </div>
            </div>
            <Button variant="outline" className="border-border gap-2">
              <Edit className="w-4 h-4" /> Editar
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Package, label: "Productos", value: "12" },
            { icon: Handshake, label: "Intercambios", value: "8" },
            { icon: Star, label: "Valoración", value: "4.0" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
