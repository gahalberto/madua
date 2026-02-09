/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração essencial para deploy em VPS
  output: 'standalone',
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: false,
  },
  
  // Garante que os arquivos estáticos sejam gerados corretamente
  generateEtags: true,
  
  // Compressão de assets
  compress: true,
};

export default nextConfig;
