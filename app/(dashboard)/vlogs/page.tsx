import { Play, Clock, Eye } from "lucide-react";
import Link from "next/link";
import { getCourses } from "@/app/actions/courses";
import { PremiumBadge } from "@/components/premium-badge";

type Lesson = { id: string; duration?: number };
type VlogModule = { lessons: Lesson[] };
type Vlog = {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  isPremium: boolean;
  modules?: VlogModule[];
};

function VlogCard({ vlog, firstLesson }: { vlog: Vlog; firstLesson: Lesson | undefined }) {
  const lessonUrl = firstLesson 
    ? `/courses/${vlog.id}/lessons/${firstLesson.id}` 
    : '#';

  // Altura aleatória para efeito Masonry
  const heights = ['h-64', 'h-80', 'h-96', 'h-72'];
  const randomHeight = heights[Math.floor(Math.random() * heights.length)];

  return (
    <Link href={lessonUrl}>
      <div className={`group relative ${randomHeight} w-full overflow-hidden rounded-xl cursor-pointer`}>
        {/* Background cinematográfico com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSI0MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-30" />
          
          {/* Overlay com degradê */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Badge Premium */}
        {vlog.isPremium && (
          <div className="absolute top-3 right-3 z-10">
            <PremiumBadge isPremium={vlog.isPremium} />
          </div>
        )}

        {/* Ícone de Play no centro (aparece no hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/90 backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="h-10 w-10 text-background fill-background ml-1" />
          </div>
        </div>

        {/* Informações do Vlog */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <div className="space-y-2">
            {vlog.category && (
              <span className="inline-block px-2 py-1 text-xs font-semibold text-accent bg-accent/20 rounded-md backdrop-blur-sm">
                {vlog.category || 'Vlog'}
              </span>
            )}
            
            <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-accent transition-colors">
              {vlog.title}
            </h3>
            
            {vlog.description && (
              <p className="text-sm text-gray-300 line-clamp-2">
                {vlog.description}
              </p>
            )}

            <div className="flex items-center gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{vlog.modules?.[0]?.lessons?.length || 0} episódios</span>
              </div>
              {vlog.modules?.[0]?.lessons?.[0]?.duration && (
                <>
                  <span>•</span>
                  <span>{Math.floor(vlog.modules[0].lessons[0].duration / 60)}min</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Efeito de brilho no hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-accent/0 via-accent/0 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </Link>
  );
}

function CategoryCarousel({ title, vlogs }: { title: string; vlogs: Vlog[] }) {
  if (vlogs.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-foreground mb-6 px-8">{title}</h2>
      
      <div className="px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vlogs.map((vlog: Vlog) => {
            const firstLesson = vlog.modules?.[0]?.lessons?.[0];
            return <VlogCard key={vlog.id} vlog={vlog} firstLesson={firstLesson} />;
          })}
        </div>
      </div>
    </section>
  );
}

export default async function VlogsPage() {
  const allCourses = await getCourses();
  const vlogs = allCourses.filter((c: { type: string }) => c.type === 'VLOG') as unknown as Vlog[];

  // Agrupar vlogs por categoria
  const vlogsByCategory = vlogs.reduce((acc: Record<string, Vlog[]>, vlog: Vlog) => {
    const category = vlog.category || 'Outros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(vlog);
    return acc;
  }, {} as Record<string, Vlog[]>);

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden mb-12">
        {/* Background cinematográfico */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSI0MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-30" />
          
          {/* Gradientes para profundidade */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Efeito de luz cinematográfica */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-radial from-accent/20 to-transparent blur-3xl" />

        {/* Content */}
        <div className="relative h-full flex items-center px-8 md:px-16">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-semibold text-red-400">AO VIVO</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Vlogs da
              <span className="block text-accent mt-2">Selva</span>
            </h1>

            <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
              Acompanhe as aventuras, desafios e aprendizados do dia a dia na natureza selvagem. 
              Conteúdo exclusivo e cinematográfico direto da selva.
            </p>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-accent" />
                <span className="text-foreground font-semibold">{vlogs.length} Episódios</span>
              </div>
              <div className="w-px h-6 bg-gray-700" />
              <span className="text-gray-400">Atualizado semanalmente</span>
            </div>
          </div>
        </div>
      </section>

      {/* Vlogs por Categoria */}
      <div className="space-y-12">
        {Object.entries(vlogsByCategory).map(([category, categoryVlogs]: [string, Vlog[]]) => (
          <CategoryCarousel 
            key={category} 
            title={category} 
            vlogs={categoryVlogs} 
          />
        ))}

        {vlogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">Nenhum vlog disponível no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
