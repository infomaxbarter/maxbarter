import { motion } from "framer-motion";
import { Handshake, Globe, Recycle, Users } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import barterExchange from "@/assets/barter-exchange.png";
import productsCollage from "@/assets/products-collage.png";

const AboutPage = () => {
  const { t } = useI18n();

  const features = [
    { icon: Handshake, titleKey: "about.feature1.title", descKey: "about.feature1.desc" },
    { icon: Globe, titleKey: "about.feature2.title", descKey: "about.feature2.desc" },
    { icon: Recycle, titleKey: "about.feature3.title", descKey: "about.feature3.desc" },
    { icon: Users, titleKey: "about.feature4.title", descKey: "about.feature4.desc" },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            {t("about.title")} <span className="text-gradient">MaxBarter</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{t("about.subtitle")}</p>
        </motion.div>

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
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{t(feature.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(feature.descKey)}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="space-y-20">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="font-display text-3xl font-bold mb-4">
                <span className="text-gradient">{t("about.howTitle")}</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>1. <span className="text-foreground font-medium">{t("about.how1")}</span></p>
                <p>2. <span className="text-foreground font-medium">{t("about.how2")}</span></p>
                <p>3. <span className="text-foreground font-medium">{t("about.how3")}</span></p>
                <p>4. <span className="text-foreground font-medium">{t("about.how4")}</span></p>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <img src={barterExchange} alt="How it works" className="w-72 lg:w-80 drop-shadow-2xl" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="flex-1">
              <h2 className="font-display text-3xl font-bold mb-4">
                <span className="text-gradient">{t("about.productsTitle")}</span>
              </h2>
              <p className="text-muted-foreground mb-4">{t("about.productsDesc")}</p>
              <p className="text-muted-foreground">{t("about.productsDesc2")}</p>
            </div>
            <div className="flex-1 flex justify-center">
              <img src={productsCollage} alt="Products" className="w-72 lg:w-80 rounded-xl shadow-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
