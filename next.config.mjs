/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração essencial para deploy em VPS
  output: 'standalone',
  
  // Permitir requisições cross-origin em desenvolvimento
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  },
  
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
