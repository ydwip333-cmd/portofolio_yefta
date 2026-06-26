# 🌐 Portofolio Yefta — Web Portofolio Pribadi

Aplikasi web portofolio pribadi berbasis **Flask (Python)** dengan fitur panel admin untuk mengelola profil, skill, proyek, dan pengalaman secara dinamis. Upload gambar menggunakan **Cloudinary** dan pengiriman email menggunakan **Resend**.

---

## Struktur Proyek

```
portofolio_yefta/
├── app.py                        # Entry point Flask
├── config.py                     # Konfigurasi aplikasi dari .env
├── model.py                      # Database connection pool (MySQL)
├── index.html                    # Halaman utama portofolio (public)
├── favicon.ico
├── .env                          # Environment variables (jangan di-commit!)
├── .env.example                  # Template environment variables
├── requirements.txt
├── DB_682024045_YEFTA.sql        # Schema & seed database
│
├── Backend/
│   ├── admin/
│   │   ├── login.py              # Autentikasi & JWT token
│   │   ├── dashboard.py          # Statistik dashboard admin
│   │   ├── profiles.py           # CRUD profil pengguna
│   │   ├── experience.py         # CRUD pengalaman
│   │   ├── projects.py           # CRUD proyek
│   │   ├── skills.py             # CRUD skill
│   │   ├── akun.py               # Manajemen akun & ganti password
│   │   └── upload.py             # Upload gambar ke Cloudinary
│   └── utama/
│       └── utama.py              # API publik (profil, skill, proyek, pengalaman, kontak)
│
├── Frontend/
│   ├── admin/
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── profil.html
│   │   ├── experience.html
│   │   ├── projects.html
│   │   ├── skills.html
│   │   ├── akun.html
│   │   ├── css/
│   │   └── js/
│   └── utama/
│       ├── css/style.css
│       └── js/script.js
│
└── screenshot/                   # Screenshot tampilan aplikasi
```

---

## Fitur

- **Halaman Portofolio Publik** — tampil dinamis dari database (profil, skill, proyek, pengalaman)
- **Panel Admin** — CRUD lengkap untuk semua konten portofolio
- **Autentikasi JWT** — login aman dengan token berbatas waktu (24 jam)
- **Upload Gambar** — integrasi Cloudinary untuk foto profil & gambar proyek
- **Kirim Email** — fitur kontak menggunakan Resend API
- **Responsive Design** — tampilan optimal di desktop, tablet, dan mobile

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | Python 3.12, Flask 3.0 |
| Database | MySQL / TiDB Cloud |
| Auth | JWT (PyJWT) + Werkzeug password hashing |
| Storage | Cloudinary |
| Email | Resend |
| Frontend | HTML, CSS, Vanilla JS |

---

## Instalasi & Menjalankan Proyek

### 1. Clone & Masuk ke Direktori

```bash
git clone <url-repo>
cd portofolio_yefta
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Setup Environment Variables

Salin `.env.example` ke `.env`, lalu isi sesuai konfigurasi:

```bash
cp .env.example .env
```

```env
FLASK_DEBUG=True
SECRET_KEY=ganti_dengan_secret_key_kamu

# Database (MySQL / TiDB Cloud)
DB_HOST=host_database_kamu
DB_PORT=4000
DB_USER=username_database
DB_PASSWORD=password_database
DB_NAME=nama_database
DB_CA_PATH=                        # Opsional: path ke CA cert (TiDB Cloud)

# Cloudinary (upload gambar)
CLOUDINARY_CLOUD_NAME=cloud_name_kamu
CLOUDINARY_API_KEY=api_key_cloudinary
CLOUDINARY_API_SECRET=api_secret_cloudinary

# Resend (kirim email dari form kontak)
RESEND_API_KEY=api_key_resend
ADMIN_EMAIL_FALLBACK=email@example.com
```

### 4. Setup Database

Jalankan file SQL untuk membuat tabel dan data awal:

```bash
mysql -h <DB_HOST> -P <DB_PORT> -u <DB_USER> -p < DB_682024045_YEFTA.sql
```

### 5. Jalankan Aplikasi

```bash
python app.py
```

Aplikasi berjalan di: `http://localhost:5000`

---

## API Endpoints

### Authentication
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/login` | Login admin | ✗ |
| POST | `/api/logout` | Logout | ✓ |
| GET | `/api/auth/check` | Cek status login | ✗ |

### Dashboard (Admin)
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/dashboard/stats` | Statistik jumlah data | ✓ |
| GET | `/api/dashboard/recent-activity` | Aktivitas terbaru | ✓ |

### Akun
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/akun` | Get data akun | ✓ |
| PUT | `/api/akun` | Update username | ✓ |
| POST | `/api/akun/change-password` | Ganti password | ✓ |

### Profil
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/profil` | Get profil publik | ✗ |
| POST | `/api/profil` | Buat profil | ✓ |
| PUT | `/api/profil` | Update profil | ✓ |

### Pengalaman (Experiences)
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/experiences` | Semua pengalaman | ✗ |
| GET | `/api/experiences/<id>` | Detail pengalaman | ✗ |
| POST | `/api/experiences` | Tambah pengalaman | ✓ |
| PUT | `/api/experiences/<id>` | Edit pengalaman | ✓ |
| DELETE | `/api/experiences/<id>` | Hapus pengalaman | ✓ |

### Proyek (Projects)
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/projects` | Semua proyek | ✗ |
| GET | `/api/projects/<id>` | Detail proyek | ✗ |
| POST | `/api/projects` | Tambah proyek | ✓ |
| PUT | `/api/projects/<id>` | Edit proyek | ✓ |
| DELETE | `/api/projects/<id>` | Hapus proyek | ✓ |

### Skill
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/skills` | Semua skill | ✗ |
| GET | `/api/skills/<id>` | Detail skill | ✗ |
| POST | `/api/skills` | Tambah skill | ✓ |
| PUT | `/api/skills/<id>` | Edit skill | ✓ |
| DELETE | `/api/skills/<id>` | Hapus skill | ✓ |

### Upload
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/upload` | Upload gambar ke Cloudinary | ✓ |

### Kontak (Publik)
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/contact` | Kirim pesan via email (Resend) | ✗ |

---

## Skema Database

| Tabel | Deskripsi |
|-------|-----------|
| `users` | Data akun admin (username, password hash, role) |
| `profiles` | Profil lengkap (nama, foto, universitas, kontak, dll) |
| `experiences` | Pengalaman kerja/organisasi (posisi, perusahaan, durasi) |
| `projects` | Portofolio proyek (judul, deskripsi, gambar, link) |
| `skills` | Keahlian/tech stack (nama, icon class FontAwesome) |

Lihat `DB_682024045_YEFTA.sql` untuk schema dan data awal lengkap.

---

## Catatan Keamanan

- **Password Hashing** — Password di-hash menggunakan Werkzeug (bcrypt-compatible)
- **JWT Token** — Autentikasi stateless dengan expiry 24 jam
- **CORS** — Saat ini diizinkan semua origin (`*`); batasi di environment production
- **Environment Variables** — Jangan pernah commit file `.env` ke version control!

---

## Screenshot

| Halaman | Preview |
|---------|---------|
| Halaman Utama | `screenshot/3. Halaman Utama.jpg` |
| Panel Admin | `screenshot/1. Halaman Admin.jpg` |
| Halaman Login | `screenshot/2. Halaman Login.jpg` |
| Upload Cloudinary | `screenshot/4. Hasil Uploud Gambar ke Cloudinary.jpg` |
| Email via Resend | `screenshot/5. Bukti Pengiriman Email menggunakan Resend.jpg` |