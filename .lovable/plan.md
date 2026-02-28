

## Plan: Admin Dashboard Geliştirme, Seed Data, Harita Konum Seçici, SEO-friendly URL'ler

### 1. Seed Data Oluşturma
- `src/lib/seedData.ts` dosyası oluştur. Tüm sayfalar için demo/seed veriler tanımla:
  - 12+ ürün (farklı kategoriler, görseller, konumlar, durumlar: aktif, pasif, demo)
  - 8+ kullanıcı profili (farklı roller, konumlar, avatarlar, biyografiler)
  - 6+ takas talebi (pending, active, matched, completed, cancelled, coming_soon durumlarında)
  - 6+ teklif (pending, accepted, rejected, cancelled)
  - 4+ takas önerisi
- Tüm sayfalarda veritabanı boşken seed data fallback olarak gösterilecek (gerçek veri varsa gerçek veri gösterilir)

### 2. Harita Üzerinden Konum Seçici Bileşen
- `src/components/LocationPicker.tsx` oluştur:
  - Leaflet haritası üzerinde tıklayarak konum seçme
  - Seçilen konumu marker ile gösterme
  - lat/lng değerlerini parent'a callback ile iletme
  - Mevcut koordinatları gösterme desteği
- Admin Dashboard'daki tüm CRUD modallarına (ürün ekle/düzenle, profil düzenle, talep düzenle) entegre et
- CreateProductPage ve ExchangeRequestsPage formlarına da ekle

### 3. SEO-friendly URL'ler (Slug Tabanlı Routing)
- URL yapısını değiştir: UUID yerine başlık tabanlı slug kullan
  - `/productos/:id` → `/productos/:slug` (slug = slugify(title)-shortId)
  - `/usuarios/:userId` → `/usuarios/:username`
- Yardımcı `slugify()` fonksiyonu oluştur (`src/lib/utils.ts`)
- `ProductDetailPage`: slug'dan ID çıkar (son segment) veya title ile arama yap
- `UserDetailPage`: username parametresi ile profil çek
- Tüm Link'leri güncellenmiş URL formatına çevir (HomePage, UsersPage, AdminDashboard, vb.)

### 4. Admin Dashboard Detaylandırma
- **Overview sekmesi**: Daha fazla istatistik kartı ekle (online/offline, aktif/pasif, beklemede, yakında, iptal sayıları)
- **Tüm sekmelerde**: Durum badge'leri renkli ve detaylı olsun (online=yeşil, offline=gri, aktif=mavi, pasif=turuncu, yakında=mor, iptal=kırmızı, demo=indigo)
- **Kullanıcılar sekmesi**: Avatar gösterimi, son giriş tarihi, ürün sayısı sütunu
- **Ürünler sekmesi**: Görsel önizleme büyütme, konum harita linki
- **Teklifler sekmesi**: Ürün isimleri gösterilsin (şu an sadece kullanıcı adları var), from/to product bilgisi
- **Talepler sekmesi**: Teklif sayısı, görsel önizleme, harita konumu
- **Proposals sekmesi**: Yeni sekme ekle - exchange_proposals tablosu için CRUD

### 5. Dosya Değişiklikleri

| Dosya | İşlem |
|-------|-------|
| `src/lib/seedData.ts` | Yeni - tüm seed veriler |
| `src/lib/utils.ts` | Düzenle - slugify fonksiyonu ekle |
| `src/components/LocationPicker.tsx` | Yeni - harita konum seçici |
| `src/App.tsx` | Düzenle - route parametreleri güncelle |
| `src/pages/AdminDashboard.tsx` | Düzenle - detaylı dashboard, proposals sekmesi, konum seçici, seed data |
| `src/pages/HomePage.tsx` | Düzenle - slug URL, seed data fallback |
| `src/pages/ProductDetailPage.tsx` | Düzenle - slug tabanlı sorgulama |
| `src/pages/UserDetailPage.tsx` | Düzenle - username tabanlı sorgulama |
| `src/pages/UsersPage.tsx` | Düzenle - username URL, seed data |
| `src/pages/ExchangeRequestsPage.tsx` | Düzenle - konum seçici, seed data |
| `src/pages/CreateProductPage.tsx` | Düzenle - konum seçici |
| `src/pages/MapPage.tsx` | Düzenle - seed data fallback |
| `src/pages/OffersPage.tsx` | Düzenle - seed data fallback |
| `src/pages/StatsPage.tsx` | Düzenle - seed data ile zengin istatistikler |
| `src/contexts/I18nContext.tsx` | Düzenle - yeni çeviri anahtarları |

