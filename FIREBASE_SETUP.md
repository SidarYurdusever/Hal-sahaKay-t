# 🔥 Firebase Kurulum Rehberi

Bu proje Firebase Realtime Database kullanıyor. Aşağıdaki adımları takip ederek kurulumu tamamlayın.

## 1️⃣ Firebase Projesi Oluştur

1. https://console.firebase.google.com/ adresine git
2. **"Add project"** (Proje Ekle) butonuna tıkla
3. Proje adı gir: **"Hal-sahaKay-t"** (veya istediğin bir isim)
4. Google Analytics'i **devre dışı bırakabilirsin** (isteğe bağlı)
5. **"Create project"** butonuna tıkla
6. Proje hazır olduğunda **"Continue"** tıkla

## 2️⃣ Realtime Database Oluştur

1. Sol menüden **"Build"** → **"Realtime Database"** seç
2. **"Create Database"** butonuna tıkla
3. **Database location** seç: **"Europe (europe-west1)"** önerilir
4. **Security rules** için: **"Start in test mode"** seç
   - ⚠️ Bu herkesin okuma/yazma yapabilmesini sağlar (arkadaşlarınla paylaşım için gerekli)
5. **"Enable"** butonuna tıkla

## 3️⃣ Web Uygulaması Ekle

1. Firebase Console'da proje ana sayfasında **"</>"** (Web) ikonuna tıkla
2. App nickname: **"Hal-sahaKay-t"**
3. **"Firebase Hosting"** kutucuğunu işaretleme (GitHub Pages kullanıyoruz)
4. **"Register app"** tıkla
5. **Firebase SDK configuration** ekranında `firebaseConfig` objesini göreceksin:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "hal-sahakay-t.firebaseapp.com",
  databaseURL: "https://hal-sahakay-t-default-rtdb.firebaseio.com",
  projectId: "hal-sahakay-t",
  storageBucket: "hal-sahakay-t.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## 4️⃣ .env Dosyası Oluştur

1. Proje klasöründe `.env` dosyası oluştur:
   ```bash
   cp .env.example .env
   ```

2. `.env` dosyasını aç ve Firebase config değerlerini yapıştır:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=hal-sahakay-t.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://hal-sahakay-t-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=hal-sahakay-t
VITE_FIREBASE_STORAGE_BUCKET=hal-sahakay-t.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

## 5️⃣ GitHub Secrets Ekle (GitHub Pages için)

GitHub'da projenin ayarlarına git:

1. **Settings** → **Secrets and variables** → **Actions**
2. **"New repository secret"** butonuna tıkla
3. Her bir environment variable için secret oluştur:
   - Name: `VITE_FIREBASE_API_KEY`, Value: `AIza...`
   - Name: `VITE_FIREBASE_AUTH_DOMAIN`, Value: `hal-sahakay-t.firebaseapp.com`
   - Name: `VITE_FIREBASE_DATABASE_URL`, Value: `https://hal-sahakay-t-default-rtdb.firebaseio.com`
   - Name: `VITE_FIREBASE_PROJECT_ID`, Value: `hal-sahakay-t`
   - Name: `VITE_FIREBASE_STORAGE_BUCKET`, Value: `hal-sahakay-t.appspot.com`
   - Name: `VITE_FIREBASE_MESSAGING_SENDER_ID`, Value: `123456789`
   - Name: `VITE_FIREBASE_APP_ID`, Value: `1:123456789:web:abc123`

## 6️⃣ Database Security Rules (İsteğe Bağlı)

Realtime Database → **Rules** sekmesine git ve şu kuralları ekle:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

⚠️ **Önemli**: Bu ayar herkese tam erişim verir. Küçük arkadaş grupları için uygundur. Büyük gruplar için authentication ekleyin.

## ✅ Kurulum Tamamlandı!

Artık projeyi çalıştırabilirsin:

```bash
npm run dev
```

Tarayıcıda http://localhost:5173 adresinde uygulamayı göreceksin.

## 🚀 Deploy

GitHub'a push yaptığında otomatik olarak Firebase ile entegre şekilde deploy olacak!

```bash
git add .
git commit -m "Add Firebase integration"
git push
```

Site: https://sidaryurdusever.github.io/Hal-sahaKay-t/
