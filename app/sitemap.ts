import { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/app/actions/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://madua.pt';

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/receitas`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/assinatura`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Buscar todas as receitas publicadas
  const posts = await getPublishedPosts();
  const receitas = posts.filter(p => p.recipe);
  const blogPosts = posts.filter(p => !p.recipe);

  // Páginas de receitas dinâmicas
  const receitasPages: MetadataRoute.Sitemap = receitas.map((receita) => ({
    url: `${baseUrl}/receitas/${receita.slug}`,
    lastModified: receita.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Páginas de blog dinâmicas
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...receitasPages, ...blogPages];
}
