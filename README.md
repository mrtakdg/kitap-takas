# 📚 Kitap Takas Uygulaması

Kitap Takas Uygulaması, kullanıcıların ellerindeki kitapları birbirleriyle takas edebilmesini sağlayan basit ama etkili bir sistemdir. 
Kullanıcılar kitap ekleyebilir, takas teklifi gönderebilir, mesajlaşabilir ve profillerini yönetebilir. 
Admin paneli üzerinden tüm kullanıcıları ve kitapları yönetmek mümkündür.

---

## 🛠 Kullanılan Teknolojiler

- **Next.js** — React tabanlı framework
- **Prisma ORM** — Veritabanı yönetimi için
- **SQLite** — Geliştirme ortamı için hafif veritabanı
- **Redux Toolkit** — Global state yönetimi
- **Bootstrap 5** — Responsive arayüz tasarımı
- **JWT (JSON Web Token)** — Kimlik doğrulama
- **Middleware** — Admin erişim kontrolü

---
## 👤 Admin Giriş Bilgileri

    Bu bilgiler sadece test içindir.
    Email: admin@com
    Şifre: 1

## 🚀 Kurulum Talimatları
```bash
git clone https://github.com/kullanici/kitap-takas.git
cd kitap-takas
npm install
npx prisma generate
npm run dev

