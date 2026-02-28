import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  title: string;
  description: string;
  image: string;
  category: string;
  location: string;
  user: string;
}

const ProductCard = ({ title, description, image, category, location, user }: ProductCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-lg overflow-hidden group cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/90 text-primary-foreground">
            {category}
          </span>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{user[0]}</span>
            </div>
            <span className="text-xs text-muted-foreground">{user}</span>
          </div>
          <span className="text-xs text-muted-foreground">{location}</span>
        </div>
        <div className="flex items-center gap-1 text-primary text-sm font-medium pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Ver detalles <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
