# TURANÇETİN — Beyaz Eşya & Küçük Ev Aletleri Web Sitesi

Profesyonel ürün kataloğu + admin paneli.

**Stack:** Next.js 16 · TypeScript · Tailwind CSS · MongoDB · Cloudinary · NextAuth · Vercel

---

## Hızlı başlangıç (lokal)

```bash
npm install
cp .env.example .env.local
# .env.local içini doldurun
npm run seed
npm run dev
```

- Site: http://localhost:3000  
- Admin: http://localhost:3000/admin/giris  
- Varsayılan admin (seed sonrası): `admin@turancetin.com` / `Admin123!`

```bash
npm run build
npm run start
```

---

## Önemli komutlar

| Komut | Açıklama |
|--------|----------|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build |
| `npm run start` | Build’i çalıştır |
| `npm run seed` | Demo veri + admin |
| `npm run create-admin -- email sifre` | Admin oluştur / şifre sıfırla |

---

## Ürün ekleme (admin kolaylığı)

Zorunlu alanlar yalnızca:

1. Ürün başlığı  
2. Kategori  
3. En az 1 görsel  
4. Aktif/Pasif  

Fiyat, marka, model, açıklama, garanti ve teknik özellikler **isteğe bağlıdır**.

---

## Deployment & kurulum rehberi

Ayrıntılı adımlar için: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## Güvenlik uyarısı

`.env` ve `.env.local` dosyalarını **asla** GitHub’a yüklemeyin.  
Cloudinary, MongoDB ve `NEXTAUTH_SECRET` değerleri gizlidir.
