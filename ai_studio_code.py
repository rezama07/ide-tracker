# To run this code you need to install the following dependencies:
# pip install google-genai

import os
from google import genai
from google.genai import types


def generate():
    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
    )

    model = "gemini-3-flash-preview"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""Saya ingin membangun aplikasi 'Daily Gratitude Journal'. Tolong buatkan struktur file-nya, berikan rekomendasi tech stack-nya (Next.js + Supabase), dan buatkan file aturan (.cursorrules) untuk memastikan kodenya bersih dan aman."""),
            ],
        ),
        types.Content(
            role="model",
            parts=[
                types.Part.from_text(text="""**Defining App Requirements**

I've been solidifying the daily gratitude journal's core requirements. Right now, I'm focusing on features: creating and listing entries, along with the user data. The tech stack will be Next.js and Supabase. Deliverables will include a defined file structure and core tech decisions.


"""),
                types.Part.from_text(text="""Membangun aplikasi **Daily Gratitude Journal** dengan **Next.js** dan **Supabase** adalah pilihan yang sangat tepat karena keduanya menawarkan kecepatan pengembangan (DX) yang luar biasa dan performa yang optimal.

Berikut adalah panduan lengkap untuk struktur proyek, teknologi, dan aturan codingnya.

---

### 1. Rekomendasi Tech Stack

*   **Framework:** Next.js 14/15 (App Router)
*   **Bahasa:** TypeScript (Wajib untuk keamanan tipe data)
*   **Database & Auth:** Supabase (PostgreSQL, Supabase Auth, & Storage jika ingin tambah foto)
*   **Styling:** Tailwind CSS + Shadcn/ui (Untuk komponen UI yang rapi)
*   **State Management:** TanStack Query (React Query) - Sangat disarankan untuk caching data jurnal.
*   **Form Handling:** React Hook Form + Zod (Untuk validasi input jurnal)
*   **Icons:** Lucide React

---

### 2. Struktur File Proyek (Modular & Scalable)

Saya merekomendasikan struktur folder di dalam `src/` agar lebih rapi.

```text
daily-gratitude/
├── src/
│   ├── app/                 # Next.js App Router (Pages & Layouts)
│   │   ├── (auth)/          # Grouping untuk login/register
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/       # Halaman utama jurnal
│   │   │   ├── [id]/        # Detail jurnal (edit/view)
│   │   │   └── page.tsx
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Landing page
│   ├── components/
│   │   ├── ui/              # Komponen dasar (Button, Input dari Shadcn)
│   │   ├── shared/          # Navbar, Footer, Sidebar
│   │   └── journal/         # Komponen spesifik fitur (JournalCard, JournalForm)
│   ├── hooks/               # Custom hooks (e.g., useJournal, useAuth)
│   ├── lib/
│   │   ├── supabase/        # Client & Server supabase config
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   └── utils.ts         # Utility functions (cn, formatDate)
│   ├── services/            # Logika API/Database (CRUD Jurnal)
│   │   └── journal.ts
│   ├── types/               # TypeScript interfaces/types
│   │   ├── database.ts      # Generated dari Supabase CLI
│   │   └── index.ts
│   └── store/               # Global state (Zustand jika diperlukan)
├── .env.local               # Variabel lingkungan (SUPABASE_URL, dll)
├── .cursorrules             # File instruksi untuk AI Cursor
├── next.config.mjs
└── tailwind.config.ts
```

---

### 3. Database Schema (Supabase)

Untuk aplikasi ini, Anda setidaknya membutuhkan tabel `entries`:

```sql
create table entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  content text not null,
  mood varchar(255),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Aktifkan Row Level Security (RLS)
alter table entries enable row level security;

-- Policy agar user hanya bisa melihat data miliknya sendiri
create policy \"Users can only access their own entries\"
  on entries for all
  using (auth.uid() = user_id);
```

---

### 4. File Aturan (.cursorrules)

Buat file bernama `.cursorrules` di root folder proyek Anda. File ini akan memastikan Cursor AI memberikan saran kode yang sesuai standar keamanan dan performa.

```markdown
# Aturan Pengembangan Daily Gratitude Journal

Anda adalah pakar Full-stack Developer yang ahli dalam Next.js, TypeScript, Tailwind CSS, dan Supabase. Ikuti aturan ini dengan ketat:

## 1. Kode & Struktur
- Gunakan Next.js **App Router** dengan folder `src/`.
- Gunakan **TypeScript** untuk semua file. Hindari penggunaan `any`.
- Gunakan komponen fungsional dengan **Tailwind CSS** untuk styling.
- Prioritaskan **Server Components** untuk fetch data dan **Client Components** hanya untuk interaktivitas.
- Gunakan file `services/` untuk logika query Supabase agar terpisah dari komponen UI.

## 2. Keamanan & Supabase
- Jangan pernah mengekspos `SUPABASE_SERVICE_ROLE_KEY` ke client-side.
- Selalu gunakan **Row Level Security (RLS)** di sisi Supabase.
- Pastikan semua mutasi (insert/update/delete) menggunakan validasi user ID dari `auth.getUser()`.
- Gunakan `middleware.ts` untuk memproteksi rute yang memerlukan autentikasi.

## 3. Komponen UI
- Gunakan komponen dari **Shadcn/ui** dan **Lucide React** untuk ikon.
- Komponen harus responsif (mobile-first).
- Gunakan pola \"Compound Components\" jika komponen menjadi terlalu kompleks.

## 4. Validasi & Error Handling
- Gunakan **Zod** untuk validasi skema data, baik di sisi client maupun server.
- Selalu berikan feedback yang jelas pada user saat terjadi error (gunakan `toast` dari Shadcn).
- Pastikan ada state loading saat melakukan proses asynchronous.

## 5. Clean Code
- Gunakan nama variabel yang deskriptif dan dalam bahasa Inggris.
- Terapkan prinsip **DRY** (Don't Repeat Yourself).
- Gunakan `cn()` utility untuk penggabungan kelas Tailwind secara dinamis.

## 6. Prosedur Penulisan File
- Sebelum membuat komponen baru, cek apakah sudah ada komponen serupa di `src/components/ui`.
- Pastikan setiap file baru memiliki ekspor default atau bernama yang konsisten.
```

---

### 5. Langkah Awal Setelah Setup

1.  **Inisialisasi Proyek:**
    `npx create-next-app@latest daily-gratitude --typescript --tailwind --eslint`
2.  **Install Supabase SDK:**
    `npm install @supabase/supabase-js @supabase/ssr`
3.  **Install Shadcn/ui:**
    `npx shadcn-ui@latest init`
4.  **Konfigurasi Supabase:**
    Buat file di `lib/supabase/client.ts` dan `lib/supabase/server.ts` sesuai dokumentasi resmi Supabase untuk Next.js.

Dengan struktur dan `.cursorrules` ini, Cursor AI akan membantu Anda membangun aplikasi yang sangat terorganisir, aman (karena penekanan pada RLS dan server components), dan mudah dikelola di masa depan."""),
            ],
        ),
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""INSERT_INPUT_HERE"""),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(
            thinking_level="HIGH",
        ),
    )

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        if text := chunk.text:
            print(text, end="")

if __name__ == "__main__":
    generate()


