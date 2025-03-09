# Fullstack Test (FE) - Ivan Rizky Saputra

![thumbnail](https://res.cloudinary.com/draaoe7rc/image/upload/v1741524757/7218c317-1507-4347-a4eb-fa5bcf6ade26.png)

<p align="center">
<a href="https://tsp-test-fe.vercel.app/">Live Demo</a>
</p>

Website ini dibuat untuk mengikuti Fullstack Test untuk PT Tri Sinar Purnama. Merupakan work order management yang dapat diakses oleh dua level pengguna (Production Manager dan Operator). Untuk backend dapat di akses di repo [ini](https://github.com/Ivanrizkys/tsp-test-be).

## Tech Stack

- React
- Typescript
- Tanstack Query
- Zustand
- TailwindcssV4 with Shadcn

## Halaman

- Login
- List Work Order
- Tambah Work Order
- Operator Report (untuk role Production Manager)

## Requirement
- Node 22.11.0 
- Pnpm [Lihat Cara Installasi](https://pnpm.io/installation)

## Run on Local

- Clone github repository ini
- Masuk ke directory penyimpanan
- Install semua dependency mengunakan "pnpm install" atau menggunakan package manager lainya.
- Setup ".env" file, dapat melihat ".env.example" sebagai acuan.
- Selanjutnya, jalankan project di terminal menggunakan "pnpm run dev" or or using another package manager.
- Buka [http://localhost:5173/](http://localhost:5173/) dengan browser untuk melihat hasilnya.

## Deploy on Vercel

Untuk memudahkan proses deployment, website ini sekarang di deploy menggunakan vercel. Untuk langkah langkah deployment hanya membutuhkan akun [Vercel](https://vercel.com/) yang tertaut dengan github tempat penyimpanan project. Kurang lebih langkah langkahnhya seperti ini.

- Import project dari github ke vercel
- Tambahkan environtment variabel
- Klik deploy

## Deploy on Own VPS

Kurang lebih, langkah langkah untuk proses deployment project ini di vps adalah seperti ini.

- Install Nodejs (disarankan untuk menggunakan versi 22.11.0).
- Instlal pnpm untuk package managernya.
- Install nginx atau alternatif lainya.
- Jalankan perintah `pnpm install` setelah itu `pnpm build`. Folder dist akan dihasilkan setelah proses ini selesai.
- Arahkan proxy dengan menggunakan nginx ke file dist/index.html
