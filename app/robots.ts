import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/dashboard/', '/login/', '/register/', '/upgrade/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/dashboard/', '/login/', '/register/', '/upgrade/'],
      },
    ],
    sitemap: 'https://madua.pt/sitemap.xml',
    host: 'https://madua.pt',
  };
}
