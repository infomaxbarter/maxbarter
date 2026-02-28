import { motion } from "framer-motion";
import { Handshake, Globe, Recycle, Users } from "lucide-react";
import barterExchange from "@/assets/barter-exchange.png";
import productsCollage from "@/assets/products-collage.png";

const features = [
  {
    icon: Handshake,
    title: "Intercambio Directo",
    description: "Intercambia tus productos directamente con otros usuarios sin necesidad de dinero.",
  },
  {
    icon: Globe,
    title: "Comunidad Global",
    description: "Conecta con personas de toda España y encuentra lo que necesitas.",
  },
  {
    icon: Recycle,
    title: "Economía Circular",
    description: "Contribuye al medio ambiente dando nueva vida a productos que ya no usas.",
  },
  {
    icon: Users,
    title: "Red de Confianza",
    description: "Sistema de valoraciones y matchs para intercambios seguros.",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Sobre <span className="text-gradient">MaxBarter</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            MaxBarter es la plataforma líder de trueque online. Nuestro objetivo es facilitar el 
            intercambio de productos entre usuarios de forma segura, sencilla y sostenible.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card rounded-xl p-6 text-center hover:glow-border transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Two column sections */}
        <div className="space-y-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row items-center gap-12"
          >
            <div className="flex-1">
              <h2 className="font-display text-3xl font-bold mb-4">
                ¿Cómo <span className="text-gradient">funciona</span>?
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>1. <span className="text-foreground font-medium">Publica</span> los productos que quieras intercambiar con fotos y descripción.</p>
                <p>2. <span className="text-foreground font-medium">Explora</span> los productos de otros usuarios y filtra por categoría o ubicación.</p>
                <p>3. <span className="text-foreground font-medium">Propón</span> un intercambio enviando una oferta al propietario.</p>
                <p>4. <span className="text-foreground font-medium">¡Match!</span> Si ambos aceptáis, el intercambio se realiza.</p>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <img src={barterExchange} alt="Cómo funciona" className="w-72 lg:w-80 drop-shadow-2xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row-reverse items-center gap-12"
          >
            <div className="flex-1">
              <h2 className="font-display text-3xl font-bold mb-4">
                Miles de <span className="text-gradient">productos</span>
              </h2>
              <p className="text-muted-foreground mb-4">
                Desde electrónica y música hasta ropa y artículos del hogar. En MaxBarter encontrarás 
                una amplia variedad de productos listos para intercambiar.
              </p>
              <p className="text-muted-foreground">
                Nuestra comunidad crece cada día, con usuarios activos en todas las comunidades 
                autónomas de España.
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <img src={productsCollage} alt="Productos" className="w-72 lg:w-80 rounded-xl shadow-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
