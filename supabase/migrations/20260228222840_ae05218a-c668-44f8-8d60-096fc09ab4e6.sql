
CREATE TABLE public.community_pages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title_tr text NOT NULL DEFAULT '',
  title_en text NOT NULL DEFAULT '',
  title_es text NOT NULL DEFAULT '',
  content_tr text NOT NULL DEFAULT '',
  content_en text NOT NULL DEFAULT '',
  content_es text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'BookOpen',
  color text NOT NULL DEFAULT 'text-blue-400',
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.community_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published community pages" ON public.community_pages
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage community pages" ON public.community_pages
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.community_pages (slug, title_tr, title_en, title_es, content_tr, content_en, content_es, icon, color, sort_order) VALUES
('getting-started', 'Başlangıç Rehberi', 'Getting Started', 'Guía de Inicio', 
 '## 1. Kurulum\nProjeyi klonlayın ve bağımlılıkları yükleyin:\n```\ngit clone https://github.com/AliHafeez337/maxbarter.git\ncd maxbarter\nnpm install\n```\n\n## 2. Yapılandırma\n.env dosyasını oluşturun ve gerekli ortam değişkenlerini ayarlayın.\n\n## 3. Çalıştırma\nnpm run dev komutuyla geliştirme sunucusunu başlatın.',
 '## 1. Installation\nClone the project and install dependencies:\n```\ngit clone https://github.com/AliHafeez337/maxbarter.git\ncd maxbarter\nnpm install\n```\n\n## 2. Configuration\nCreate .env file and set required environment variables.\n\n## 3. Run\nStart the development server with npm run dev.',
 '## 1. Instalación\nClona el proyecto e instala las dependencias:\n```\ngit clone https://github.com/AliHafeez337/maxbarter.git\ncd maxbarter\nnpm install\n```\n\n## 2. Configuración\nCrea el archivo .env y configura las variables.\n\n## 3. Ejecutar\nInicia con npm run dev.',
 'BookOpen', 'text-blue-400', 1),
('api-docs', 'API Dokümantasyonu', 'API Documentation', 'Documentación API',
 '## Kimlik Doğrulama\nJWT tabanlı kimlik doğrulama sistemi.\n\n## Ürünler API\nRESTful API ile CRUD işlemleri.\n\n## Takas API\nTakas talebi oluşturma ve eşleştirme.',
 '## Authentication\nJWT-based authentication system.\n\n## Products API\nRESTful API for CRUD operations.\n\n## Exchange API\nCreate exchange requests and matching.',
 '## Autenticación\nSistema JWT.\n\n## API de Productos\nAPI RESTful para operaciones CRUD.\n\n## API de Intercambio\nCrear solicitudes e emparejamiento.',
 'Code2', 'text-emerald-400', 2),
('contributing', 'Katkı Rehberi', 'Contributing Guide', 'Guía de Contribución',
 '## 1. Fork & Clone\nProjeyi fork''layın, kendi branch''ınızı oluşturun.\n\n## 2. Pull Request\nDetaylı bir PR oluşturun.\n\n## 3. İnceleme\nEkip PR''ınızı inceleyecektir.',
 '## 1. Fork & Clone\nFork the project and create your branch.\n\n## 2. Pull Request\nCreate a detailed PR.\n\n## 3. Review\nThe team will review your PR.',
 '## 1. Fork & Clone\nHaz fork del proyecto.\n\n## 2. Pull Request\nCrea un PR detallado.\n\n## 3. Revisión\nEl equipo revisará tu PR.',
 'GitPullRequest', 'text-purple-400', 3),
('faq', 'Sık Sorulan Sorular', 'FAQ', 'Preguntas Frecuentes',
 '## MaxBarter ücretsiz mi?\nEvet! Tamamen ücretsiz ve açık kaynak.\n\n## Nasıl takas yapabilirim?\nÜrün yayınlayın, teklifleri inceleyin.\n\n## Verilerim güvende mi?\nRLS politikalarıyla korunur.',
 '## Is MaxBarter free?\nYes! Completely free and open source.\n\n## How do I exchange?\nPost your product, review offers.\n\n## Is my data safe?\nProtected with RLS policies.',
 '## ¿Es gratis MaxBarter?\n¡Sí! Completamente gratis y open source.\n\n## ¿Cómo intercambio?\nPublica tu producto, revisa ofertas.\n\n## ¿Están seguros mis datos?\nProtegidos con políticas RLS.',
 'MessageCircle', 'text-amber-400', 4),
('contributors', 'Katkıda Bulunanlar', 'Contributors', 'Contribuidores',
 '## Çekirdek Ekip\nPlatform mimarisi ve güvenlikten sorumlu.\n\n## Topluluk Katkıları\nHata düzeltmeleri, çeviriler ve dokümantasyon.',
 '## Core Team\nResponsible for architecture and security.\n\n## Community Contributions\nBug fixes, translations and documentation.',
 '## Equipo Central\nResponsable de arquitectura y seguridad.\n\n## Contribuciones\nCorrecciones, traducciones y documentación.',
 'Heart', 'text-pink-400', 5),
('code-of-conduct', 'Davranış Kuralları', 'Code of Conduct', 'Código de Conducta',
 '## Saygı\nHer topluluk üyesine saygılı davranın.\n\n## Kapsayıcılık\nHerkesin katılabileceği bir ortam.\n\n## Uygulama\nKuralları ihlal edenler değerlendirilir.',
 '## Respect\nTreat every member with respect.\n\n## Inclusivity\nCreate an inclusive environment.\n\n## Enforcement\nViolations are evaluated by moderators.',
 '## Respeto\nTrata a cada miembro con respeto.\n\n## Inclusividad\nCrea un ambiente inclusivo.\n\n## Aplicación\nLas violaciones son evaluadas.',
 'Globe', 'text-cyan-400', 6);
