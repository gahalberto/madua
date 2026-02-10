import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Madua - A Reconquista da Neantropia',
    short_name: 'Madua',
    description: 'Resgate a força ancestral através da alimentação tradicional e filosofia de vida neantrópica',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0A',
    theme_color: '#D4AF37',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/logo/logo-somente-simbolo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/logo/logo-dourado.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['health', 'food', 'lifestyle', 'education'],
    lang: 'pt-PT',
  };
}
