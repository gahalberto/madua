'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost } from '@/app/actions/posts';
import { generateSlug } from '@/lib/utils/slug';
import { RichTextEditor } from '@/components/rich-text-editor';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, ChefHat, Image as ImageIcon } from 'lucide-react';

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!slug) {
      setSlug(generateSlug(newTitle));
    }
    if (!metaTitle) {
      setMetaTitle(newTitle);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createPost({
        title,
        slug,
        excerpt,
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
        alert(result.error || 'Erro ao criar post');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erro ao criar post');
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-white">Novo Post</h1>
            <p className="text-zinc-400 mt-1">Criar artigo ou receita</p>
          </div>
        </div>
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
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                placeholder="Ex: Bife Grelhado com Legumes"
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
                placeholder="bife-grelhado-com-legumes"
                required
              />
              <p className="text-xs text-zinc-500 mt-1">
                URL: /blog/{slug || 'seu-slug'}
              </p>
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
                placeholder="Descrição curta que aparecerá nos resultados de busca"
              />
            </div>

            {/* Content - Rich Text Editor */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
              <label className="block text-sm font-medium text-zinc-300 mb-4">
                Conteúdo <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Cole aqui o conteúdo do teu E-book ou escreve diretamente..."
              />
            </div>

            {/* Recipe Section */}
            {isRecipe && (
              <div className="bg-zinc-900 rounded-lg border border-[#D4AF37]/30 p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <ChefHat className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="text-lg font-bold text-white">Dados da Receita</h3>
                </div>

                {/* Times and Servings */}
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
                      placeholder="15"
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
                      placeholder="20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Porções</label>
                    <input
                      type="number"
                      value={servings}
                      onChange={(e) => setServings(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                      placeholder="2"
                    />
                  </div>
                </div>

                {/* Difficulty */}
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

                {/* Ingredients */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Ingredientes (JSON) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white font-mono text-sm"
                    rows={6}
                    placeholder='[{"name":"Bife","quantity":"200","unit":"g"},{"name":"Azeite","quantity":"1","unit":"colher"}]'
                    required={isRecipe}
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Array JSON com: name, quantity, unit
                  </p>
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Instruções (JSON) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white font-mono text-sm"
                    rows={6}
                    placeholder='["Tempere o bife com sal e pimenta","Aqueça o azeite na frigideira","Grelhe o bife 3-4 minutos de cada lado"]'
                    required={isRecipe}
                  />
                  <p className="text-xs text-zinc-500 mt-1">Array JSON com cada passo</p>
                </div>

                {/* Nutrition */}
                <div>
                  <h4 className="text-sm font-medium text-zinc-300 mb-3">
                    Informação Nutricional (Opcional)
                  </h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Calorias</label>
                      <input
                        type="number"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-white text-sm"
                        placeholder="350"
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
                        placeholder="40"
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
                        placeholder="15"
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
                        placeholder="20"
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
                  {loading ? 'Salvando...' : 'Salvar Post'}
                </button>
                {slug && (
                  <Link
                    href={`/blog/${slug}`}
                    target="_blank"
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </Link>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                Imagem de Capa
              </label>
              
              {image ? (
                <div className="space-y-3">
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-zinc-800">
                    <img
                      src={image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="text-sm text-red-500 hover:text-red-400"
                  >
                    Remover imagem
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center hover:border-[#D4AF37]/50 transition-colors">
                  <ImageIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm text-zinc-400 mb-3">Cole o URL da imagem</p>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
              )}
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
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setIsRecipe(false)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    !isRecipe
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  <div className="text-3xl mb-2">📚</div>
                  <p className="font-bold text-white mb-1">Artigo</p>
                  <p className="text-sm text-zinc-400">Filosofia, Neantropia, Conceitos</p>
                </button>
                <button
                  type="button"
                  onClick={() => setIsRecipe(true)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    isRecipe
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  <div className="text-3xl mb-2">👨‍🍳</div>
                  <p className="font-bold text-white mb-1">Receita</p>
                  <p className="text-sm text-zinc-400">Protocolos culinários práticos</p>
                </button>
              </div>
              <label className="flex items-center gap-3 cursor-pointer hidden">
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
                    placeholder="Título para Google"
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
                    placeholder="Descrição para Google"
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
