import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const categories = ["electronics", "music", "sports", "books", "clothing", "gaming", "home", "other"] as const;

const categoryLabels: Record<string, string> = {
  electronics: "cat.electronics", music: "cat.music", sports: "cat.sports",
  books: "cat.books", clothing: "cat.clothing", gaming: "cat.gaming",
  home: "cat.home", other: "other",
};

const CreateProductPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useI18n();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<typeof categories[number]>("other");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl: string | null = null;
    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("product-images").upload(path, imageFile);
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }
    }

    const { error } = await supabase.from("products").insert({
      user_id: user.id,
      title,
      description,
      category,
      location,
      image_url: imageUrl,
    });

    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "✅", description: "Product created!" });
      navigate("/products");
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="glass-card rounded-2xl p-8">
            <h1 className="font-display text-2xl font-bold mb-6">New Product</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Title *</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-secondary border-border" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="bg-secondary border-border min-h-[100px]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button key={cat} type="button" onClick={() => setCategory(cat)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${category === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                      {t(categoryLabels[cat])}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Image</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors border border-border">
                    <Upload className="w-4 h-4" />
                    {imageFile ? imageFile.name : "Choose file"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-display font-bold h-12">
                {loading ? "Creating..." : "Create Product"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateProductPage;
