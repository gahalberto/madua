import { Play, Clock, BookOpen } from "lucide-react";

export default function AulasPage() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Aulas</h1>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#121212] border border-[#1F1F1F] rounded-lg overflow-hidden hover:border-accent transition-colors">
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-accent-dark to-accent w-full flex items-center justify-center">
                <Play className="h-12 w-12 text-background opacity-50" />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-foreground font-semibold text-lg mb-2">
                  Curso de Exemplo {i}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Descrição breve do curso e seus principais tópicos abordados.
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-500">
                    <BookOpen className="h-4 w-4" />
                    <span>12 aulas</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>3h 45m</span>
                  </div>
                </div>

                <button className="mt-4 w-full bg-accent hover:bg-accent-light text-background font-medium py-2 rounded-lg transition-colors">
                  Continuar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
