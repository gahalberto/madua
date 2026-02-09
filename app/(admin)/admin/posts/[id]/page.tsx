'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updatePost, deletePost } from '@/app/actions/posts';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, ChefHat, Trash2 } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  category: string;
  metaTitle: string | null;
  metaDescription: string | null;
  isPublished: boolean;
  isPremium: boolean;
  recipe: {
    id: string;
    prepTime: number | null;
    cookTime: number | null;
    servings: number | null;
    difficulty: string | null;
    ingredients: string;
    instructions: string;
    calories: number | null;
    protein: number | null;
    carbs: number | null;
    fats: number | null;
  } | null;
}

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [post, setPost] = useState<Post | null>(null);
  const [isRecipe, setIsRecipe] = useState(false);

  // Post fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('nutrição');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // Recipe fields
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState('Média');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  // Carregar post
  useEffect(() => {
    async function loadPost() {
      try {
        const response = await fetch(`/api/posts/${params.id}`);
        if (!response.ok) throw new Error('Post não encontrado');
        
        const data: Post = await response.json();
        setPost(data);
        
        // Preencher campos
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt || '');
        setContent(data.content);
        setImage(data.image || '');
        setCategory(data.category);
        setMetaTitle(data.metaTitle || '');
        setMetaDescription(data.metaDescription || '');
        setIsPublished(data.isPublished);
        setIsPremium(data.isPremium);
        
        if (data.recipe) {
          setIsRecipe(true);
          setPrepTime(data.recipe.prepTime?.toString() || '');
          setCookTime(data.recipe.cookTime?.toString() || '');
          setServings(data.recipe.servings?.toString() || '');
          setDifficulty(data.recipe.difficulty || 'Média');
          setIngredients(data.recipe.ingredients);
          setInstructions(data.recipe.instructions);
          setCalories(data.recipe.calories?.toString() || '');
          setProtein(data.recipe.protein?.toString() || '');
          setCarbs(data.recipe.carbs?.toString() || '');
          setFats(data.recipe.fats?.toString() || '');
        }
      } catch (error) {
        console.error('Error loading post:', error);
        alert('Erro ao carregar post');
        router.push('/admin/posts');
      }
    }
    
    loadPost();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updatePost(params.id, {
        title,
        slug,
        excerpt: excerpt || undefined,
        content,
        image: image || undefined,
        categoryId: category || undefined,
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
        isPublished,
        isPremium,
        ...(isRecipe && {
          recipe: {
            prepTime: prepTime ? parseInt(prepTime) : undefined,
            cookTime: cookTime ? parseInt(cookTime) : undefined,
            servings: servings ? parseInt(servings) : undefined,
            difficulty,
            ingredients,
            instructions,
            calories: calories ? parseInt(calories) : undefined,
            protein: protein ? parseFloat(protein) : undefined,
            carbs: carbs ? parseFloat(carbs) : undefined,
            fats: fats ? parseFloat(fats) : undefined,
          },
        }),
      });

      if (result.success) {
        router.push('/admin/posts');
      } else {
        alert(result.error || 'Erro ao atualizar post');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erro ao atualizar post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar este post? Esta ação não pode ser desfeita.')) {
      return;
    }

    setDeleting(true);
    try {
      const result = await deletePost(params.id);
      if (result.success) {
        router.push('/admin/posts');
      } else {
        alert(result.error || 'Erro ao deletar post');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erro ao deletar post');
    } finally {
      setDeleting(false);
    }
  };

  if (!post) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
          <p className="text-zinc-400">Carregando post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/posts"
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Editar Post</h1>
              <p className="text-zinc-400 mt-1">{post.title}</p>
            </div>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? 'Deletando...' : 'Deletar'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>

              {/* Slug */}
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Slug (URL) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37] font-mono text-sm"
                  required
                />
                <p className="text-xs text-zinc-500 mt-1">URL: /blog/{slug}</p>
              </div>

              {/* Excerpt */}
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Resumo (Para Google)
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  rows={3}
                />
              </div>

              {/* Content */}
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Conteúdo (HTML/Markdown) <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37] font-mono text-sm"
                  rows={15}
                  required
                />
              </div>

              {/* Recipe Section */}
              {isRecipe && (
                <div className="bg-zinc-900 rounded-lg border border-[#D4AF37]/30 p-6 space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ChefHat className="w-5 h-5 text-[#D4AF37]" />
                    <h3 className="text-lg font-bold text-white">Dados da Receita</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Prep. (min)
                      </label>
                      <input
                        type="number"
                        value={prepTime}
                        onChange={(e) => setPrepTime(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Cozedura (min)
                      </label>
                      <input
                        type="number"
                        value={cookTime}
                        onChange={(e) => setCookTime(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Porções</label>
                      <input
                        type="number"
                        value={servings}
                        onChange={(e) => setServings(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Dificuldade
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="Fácil">Fácil</option>
                      <option value="Média">Média</option>
                      <option value="Difícil">Difícil</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Ingredientes (JSON) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white font-mono text-sm"
                      rows={6}
                      required={isRecipe}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Instruções (JSON) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white font-mono text-sm"
                      rows={6}
                      required={isRecipe}
                    />
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-zinc-300 mb-3">
                      Informação Nutricional
                    </h4>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Calorias</label>
                        <input
                          type="number"
                          value={calories}
                          onChange={(e) => setCalories(e.target.value)}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Proteína (g)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={protein}
                          onChange={(e) => setProtein(e.target.value)}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Carbs (g)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={carbs}
                          onChange={(e) => setCarbs(e.target.value)}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Gorduras (g)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={fats}
                          onChange={(e) => setFats(e.target.value)}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                <h3 className="font-bold text-white mb-4">Ações</h3>
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#D4AF37] hover:bg-[#C5A028] text-black font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                  <Link
                    href={`/blog/${slug}`}
                    target="_blank"
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </Link>
                </div>
              </div>

              {/* Image */}
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Imagem (URL)
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm"
                />
              </div>

              {/* Category */}
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                >
                  <option value="nutrição">Nutrição</option>
                  <option value="receitas">Receitas</option>
                  <option value="treino">Treino</option>
                  <option value="mindset">Mindset</option>
                  <option value="saúde">Saúde</option>
                </select>
              </div>

              {/* Type */}
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                <h3 className="font-bold text-white mb-4">Tipo de Conteúdo</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRecipe}
                    onChange={(e) => setIsRecipe(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="text-white font-medium">É uma receita</p>
                    <p className="text-xs text-zinc-500">Adicionar campos de receita</p>
                  </div>
                </label>
              </div>

              {/* Status */}
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                <h3 className="font-bold text-white mb-4">Status</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="text-white font-medium">Publicar</p>
                      <p className="text-xs text-zinc-500">Visível publicamente</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPremium}
                      onChange={(e) => setIsPremium(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="text-white font-medium">Premium</p>
                      <p className="text-xs text-zinc-500">Apenas para membros</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* SEO */}
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                <h3 className="font-bold text-white mb-4">SEO</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
