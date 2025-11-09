# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Proje Hakkında
Hal-sahaKay-t, halısaha maçları için kadro düzenleme web sitesidir. Kullanıcılar 5-11 kişilik kadrolar oluşturabilir, oyuncuları sürükle-bırak ile konumlandırabilir ve maç skorlarını takip edebilir.

### Temel Özellikler
- 5-11 kişilik kadro seçenekleri
- Hazır dizilişler (4-3-3, 4-4-2, 3-5-2, vb.)
- Sürükle-bırak ile oyuncu konumlandırma
- Oyuncu bilgileri: isim, numara, fotoğraf (opsiyonel)
- Maç skor kayıt sistemi
- Mobil ve masaüstü uyumlu responsive tasarım
- GitHub Pages üzerinden paylaşılabilir kadrolar
- "Maç Gününe Git" özelliği ile kadroların paylaşımı

## Komutlar

```bash
# Geliştirme sunucusunu başlat (http://localhost:5173)
npm run dev

# Production build oluştur
npm run build

# Production build'i önizle
npm run preview

# Lint kontrolü
npm run lint

# Bağımlılıkları yükle
npm install
```

## Mimari ve Yapı

### Teknoloji Stack (Seçildi: Modern Stack)
- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Drag & Drop**: @dnd-kit (core, sortable, utilities)
- **State Management**: React useState/useContext (şimdilik)
- **Storage**: LocalStorage API

### Planlanan Klasör Yapısı
```
/src
  /components
    - Field.jsx/tsx          # Saha görünümü
    - PlayerCard.jsx/tsx     # Oyuncu kartları
    - FormationSelector.jsx  # Diziliş seçici
    - ScoreTracker.jsx       # Skor takip
  /formations
    - formations.js          # Hazır diziliş şablonları (4-3-3, 4-4-2, vb.)
  /utils
    - storage.js             # LocalStorage yönetimi
    - export.js              # Kadro paylaşım/export
  /styles
    - field.css              # Saha stilleri
    - responsive.css         # Mobil uyumluluk
```

### Veri Yönetimi
- LocalStorage ile tarayıcıda veri saklama
- JSON formatında kadro ve maç verileri
- URL parametreleri ile kadro paylaşımı
- İsteğe bağlı: Firebase/Supabase gibi backend entegrasyonu

### Responsive Tasarım
- Mobile-first yaklaşım
- Breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop)
- Touch-friendly sürükle-bırak için mobil optimizasyonlar

## GitHub Yapılandırması
- Repository: Public olarak ayarlanmalı
- GitHub Pages: gh-pages branch veya /docs klasörü kullanılabilir
- GitHub Actions ile otomatik deployment

## Geliştirme Notları
- Türkçe arayüz öncelikli, gerekirse İngilizce dil desteği eklenebilir
- Tarayıcı uyumluluğu: Modern browsers (Chrome, Firefox, Safari, Edge)
- Performans: Büyük takım fotoğrafları için image optimization gerekebilir
