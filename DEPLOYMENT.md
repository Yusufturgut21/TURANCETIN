# TURANÇETİN — Adım Adım Kurulum & Deployment Rehberi

Bu rehber, projeyi bilgisayarınızda çalıştırmaktan canlıya almaya kadar her adımı anlatır.

---

## 1) MongoDB Atlas hesabı oluşturma

1. Tarayıcıda açın: https://www.mongodb.com/cloud/atlas/register  
2. E-posta ile ücretsiz hesap oluşturun (Google ile de olur).  
3. E-postanızı doğrulayın.

---

## 2) MongoDB Cluster oluşturma

1. Giriş yaptıktan sonra **Create** / **Build a Database** deyin.  
2. **M0 Free** (ücretsiz) seçin.  
3. Cloud provider: AWS (veya size yakın bölge).  
4. Region: mümkünse `Frankfurt (eu-central-1)` veya `Ireland`.  
5. Cluster adına örn. `turancetin` verin.  
6. **Create Deployment** / **Create Cluster**.

---

## 3) Database oluşturma

Atlas’ta ayrı “Create Database” butonu şart değildir.  
Connection string’e `/turancetin` eklediğinizde ilk veri yazımında database otomatik oluşur.

Örnek:

`...mongodb.net/turancetin?retryWrites=true&w=majority`

---

## 4) Database User oluşturma

1. Sol menü: **Database Access**  
2. **Add New Database User**  
3. Authentication: **Password**  
4. Username: örn. `turancetin_admin`  
5. Password: güçlü bir şifre oluşturun (kaydedin!)  
6. Privileges: **Atlas admin** veya **Read and write to any database**  
7. **Add User**

> Şifrede `@ # : / ?` gibi karakterler varsa connection string’de URL-encode edin.

---

## 5) Network Access ayarlama

1. Sol menü: **Network Access**  
2. **Add IP Address**  
3. Geliştirme için: **Add Current IP Address**  
4. Vercel production için: **Allow Access from Anywhere** → `0.0.0.0/0`  
   (Vercel IP’leri değişkendir; küçük/orta projelerde bu yaygın çözümdür.)  
5. **Confirm**

---

## 6–7) Connection string ve MONGODB_URI

1. **Database** → cluster’ınız → **Connect**  
2. **Drivers** seçin  
3. Connection string’i kopyalayın:

```
mongodb+srv://turancetin_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

4. `<password>` yerine gerçek şifreyi yazın.  
5. Host’tan sonra database adını ekleyin:

```
mongodb+srv://turancetin_admin:SIFRE@cluster0.xxxxx.mongodb.net/turancetin?retryWrites=true&w=majority
```

Bu değer `.env.local` içinde `MONGODB_URI=` olur.

---

## 8) .env.local oluşturma

Proje klasöründe:

```bash
cp .env.example .env.local
```

`.env.local` dosyasını açıp doldurun:

- `MONGODB_URI`
- `NEXTAUTH_SECRET` (aşağıda)
- `AUTH_SECRET` (aynı değeri koyabilirsiniz)
- Cloudinary alanları
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

Secret üretmek (Linux/Mac):

```bash
openssl rand -base64 32
```

Çıkan metni `NEXTAUTH_SECRET` ve `AUTH_SECRET` olarak yapıştırın.

---

## 9) MongoDB’yi Next.js’e bağlama

Proje bunu zaten yapıyor:

- `lib/mongodb.ts` → bağlantı + cache  
- `models/*` → Mongoose modelleri  
- API route’lar `connectDB()` çağırır  

Sizin yapmanız gereken: doğru `MONGODB_URI` koymak.

---

## 10–12) Cloudinary hesabı ve görsel yükleme

1. https://cloudinary.com/users/register_free  
2. Hesap oluşturun, panele girin.  
3. Dashboard’da göreceksiniz:
   - **Cloud Name**
   - **API Key**
   - **API Secret** (Reveal)
4. Bunları `.env.local` içine yazın:

```
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Admin panelinde görsel seçince `/api/upload` Cloudinary’ye yükler; MongoDB’de yalnızca URL saklanır.

---

## Lokal çalıştırma

```bash
npm install
npm run seed
npm run dev
```

- Site: http://localhost:3000  
- Admin: http://localhost:3000/admin/giris  
- Seed admin: `admin@turancetin.com` / `Admin123!` (veya `.env.local`’deki `ADMIN_*`)

Sadece admin oluşturmak için:

```bash
npm run create-admin -- sizin@mail.com GucluSifre123
```

---

## 13–14) GitHub repository

**Uyarı:** `.env.local` GitHub’a gitmemeli. `.gitignore` bunu engeller. Yine de commit öncesi kontrol edin.

```bash
git init
git add .
git status   # .env.local listede OLMAMALI
git commit -m "Initial commit: TURANÇETİN beyaz eşya kataloğu"
git branch -M main
```

GitHub’da yeni repo oluşturun (https://github.com/new), sonra:

```bash
git remote add origin https://github.com/KULLANICI/REPO.git
git push -u origin main
```

---

## 15–17) Vercel + Environment Variables

1. https://vercel.com → GitHub ile giriş  
2. **Add New… → Project**  
3. GitHub reponuzu seçin → **Import**  
4. Framework: Next.js (otomatik)  
5. **Environment Variables** bölümüne `.env.local`’deki tüm secret’ları ekleyin:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL` → production domain (örn. `https://www.turancetin.com.tr`)
   - `NEXT_PUBLIC_SITE_URL` → aynı domain
   - Cloudinary üçlüsü
   - isteğe bağlı WhatsApp/telefon
6. Environment seçimi:
   - **Production**: canlı site  
   - **Preview**: PR / branch önizleme  
   - **Development**: nadiren kullanılır  
7. **Deploy**

---

## 18–19) Atlas + Vercel bağlantısı & production

1. Atlas **Network Access**’te `0.0.0.0/0` olduğundan emin olun.  
2. Vercel deploy log’unda build hatası yoksa site açılır.  
3. `/admin/giris` ile giriş deneyin.  
4. Ürün ekleyip ana sayfada göründüğünü kontrol edin.

Seed’i production DB’ye (dikkatli!) lokalden production URI ile çalıştırabilirsiniz; ya da admin panelinden elle ekleyin.

---

## 20–21) Custom domain & SSL

1. Vercel proje → **Settings → Domains**  
2. `turancetin.com.tr` ve `www.turancetin.com.tr` ekleyin.  
3. Domain sağlayıcınızda (Nic.tr / Cloudflare vb.) DNS:

**Vercel’in gösterdiği kayıtlara göre:**

- `A` kaydı → Vercel IP (genelde `76.76.21.21`)  
  veya  
- `CNAME` `www` → `cname.vercel-dns.com`

4. DNS yayıldıktan sonra Vercel otomatik **HTTPS/SSL** (Let’s Encrypt) verir.  
5. `NEXTAUTH_URL` ve `NEXT_PUBLIC_SITE_URL` değerlerini domain’e güncelleyip Redeploy edin.

---

## 22) İlk admin hesabı

```bash
npm run create-admin -- admin@sirket.com GucluSifre123
```

veya `npm run seed` (demo admin + demo ürünler).

---

## 23–27) İlk içerikler (Admin panel)

1. `/admin/giris` → giriş  
2. **Kategoriler** → ad yaz → Kaydet  
3. **Markalar** → ad + isteğe bağlı logo  
4. **Ürünler → Yeni Ürün** → ad + kategori + fotoğraf → Kaydet  
5. **Bannerlar** → görsel + başlık  
6. **Kampanyalar** → başlık + ürün seçimi + tarihler  

**Site Ayarları**ndan telefon, WhatsApp, adres güncelleyin.

---

## Environment farkları (özet)

| Ortam | Ne zaman | URL örneği |
|--------|----------|------------|
| Local | bilgisayarınız | localhost:3000 |
| Preview | GitHub PR | xxx.vercel.app |
| Production | canlı | www.turancetin.com.tr |

Her ortamda Vercel’de ayrı env değeri tanımlayabilirsiniz.

---

## Kontrol listesi

- [ ] Ana sayfa açılıyor  
- [ ] Mobil menü çalışıyor  
- [ ] Ürün listesi / detay  
- [ ] Fiyatsız ürün “iletişime geçin” gösteriyor  
- [ ] WhatsApp butonu doğru numarayı açıyor  
- [ ] Admin giriş  
- [ ] Ürün ekle / düzenle / sil / kopyala  
- [ ] Cloudinary görsel yükleme  
- [ ] İletişim formu → Talepler  
- [ ] `npm run build` hatasız  

---

## Mimari özeti

```
app/(shop)/     → müşteri sitesi
app/admin/      → yönetim paneli
app/api/        → REST API (admin korumalı)
models/         → MongoDB şemaları
lib/            → db, auth, cloudinary, queries
components/     → UI
scripts/        → seed & create-admin
```

İleride sepet / ödeme eklenebilir; mevcut katalog mimarisi buna açıktır.
