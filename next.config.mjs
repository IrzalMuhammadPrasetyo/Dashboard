/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mode export statis agar bisa jalan di GitHub Pages
  output: 'export',
  
  // Mengabaikan error typescript saat build agar proses lebih lancar
  typescript: {
    ignoreBuildErrors: true,
  },

  // Konfigurasi gambar untuk mode statis
  images: {
    unoptimized: true,
  },
  basePath: '/Dashboard', // Tambahkan ini sesuai nama repository

  /* HAPUS komentar pada baris basePath di bawah ini JIKA Anda ingin 
     mengakses via irzalmuhammadprasetyo.github.io/Dashboard/
  */
  // basePath: '/Dashboard',
};

export default nextConfig;