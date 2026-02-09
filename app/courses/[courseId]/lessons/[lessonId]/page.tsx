"use client";

import { useState, useEffect } from "react";
import { Check, Lock, ChevronDown, ChevronUp, FileText, MessageSquare, Download, Play, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { VideoPlayer } from "@/components/video-player";
import { CommentsList } from "@/components/comments-list";
import { getCommentsByLessonId, type CommentWithUser } from "@/app/actions/comments";

// Mock data
const courseData = {
  id: "1",
  title: "Fundamentos da Sobrevivência na Selva",
  modules: [
    {
      id: "m1",
      title: "Introdução e Preparação",
      order: 1,
      lessons: [
        { id: "1", title: "Boas-vindas ao Curso", duration: "5:30", isCompleted: true, isFree: true },
        { id: "2", title: "Equipamentos Essenciais", duration: "12:45", isCompleted: true, isFree: true },
        { id: "3", title: "Planejamento de Expedição", duration: "18:20", isCompleted: false, isFree: false },
      ],
    },
    {
      id: "m2",
      title: "Orientação e Navegação",
      order: 2,
      lessons: [
        { id: "4", title: "Leitura de Mapas", duration: "15:10", isCompleted: false, isFree: false },
        { id: "5", title: "Uso de Bússola", duration: "20:30", isCompleted: false, isFree: false },
        { id: "6", title: "Navegação por Estrelas", duration: "14:50", isCompleted: false, isFree: false },
      ],
    },
    {
      id: "m3",
      title: "Construção de Abrigos",
      order: 3,
      lessons: [
        { id: "7", title: "Tipos de Abrigos", duration: "10:15", isCompleted: false, isFree: false },
        { id: "8", title: "Construção Passo a Passo", duration: "25:40", isCompleted: false, isFree: false },
        { id: "9", title: "Proteção Contra Intempéries", duration: "16:30", isCompleted: false, isFree: false },
      ],
    },
  ],
};

const currentLesson = {
  id: "2",
  title: "Equipamentos Essenciais",
  description: "Nesta aula, você aprenderá sobre os equipamentos fundamentais para qualquer expedição de sobrevivência. Cobriremos desde itens básicos até ferramentas especializadas que podem fazer a diferença em situações críticas.",
  videoUrl: "https://example.com/video.mp4",
  duration: "12:45",
  materials: [
    { id: "1", name: "Lista de Equipamentos.pdf", size: "2.5 MB" },
    { id: "2", name: "Guia de Manutenção.pdf", size: "1.8 MB" },
    { id: "3", name: "Checklist de Expedição.pdf", size: "0.9 MB" },
  ],
};

type Lesson = { id: string; title: string; duration?: number | string; isFree?: boolean; isCompleted?: boolean };
type CourseModule = { id: string; title: string; order?: number; lessons: Lesson[] };

function ModuleItem({ module, currentLessonId, onLessonClick }: { module: CourseModule; currentLessonId: string; onLessonClick: (lessonId: string) => void }) {
  const [isOpen, setIsOpen] = useState(true);
  // const hasCurrentLesson = module.lessons.some((l: Lesson) => l.id === currentLessonId);

  return (
    <div className="border-b border-[#1F1F1F] last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-[#1F1F1F] transition-colors"
      >
        <div className="flex-1 text-left">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Módulo {module.order}: {module.title}
          </h3>
          <p className="text-xs text-gray-500">
            {module.lessons.length} aulas
          </p>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="pb-2">
          {module.lessons.map((lesson: Lesson) => (
            <button
              key={lesson.id}
              onClick={() => onLessonClick(lesson.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1F1F1F] transition-colors",
                lesson.id === currentLessonId && "bg-[#1F1F1F] border-l-2 border-accent"
              )}
            >
              <div className="flex-shrink-0">
                {lesson.isCompleted ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent">
                    <Check className="h-4 w-4 text-background" />
                  </div>
                ) : lesson.isFree ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-600">
                    <Play className="h-3 w-3 text-gray-500" />
                  </div>
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-600">
                    <Lock className="h-3 w-3 text-gray-500" />
                  </div>
                )}
              </div>

              <div className="flex-1 text-left">
                <p className={cn(
                  "text-sm font-medium",
                  lesson.id === currentLessonId ? "text-accent" : "text-foreground"
                )}>
                  {lesson.title}
                </p>
                <p className="text-xs text-gray-500">{lesson.duration}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type CourseData = { id: string; title: string; modules: CourseModule[] };

function CourseSidebar({ courseData, currentLessonId, onLessonClick }: { courseData: CourseData; currentLessonId: string; onLessonClick: (lessonId: string) => void }) {
  return (
    <aside className="w-full lg:w-80 bg-[#121212] border-l border-[#1F1F1F] overflow-y-auto">
      <div className="sticky top-0 bg-[#121212] border-b border-[#1F1F1F] p-4 z-10 space-y-3">
        {/* Botão de voltar */}
        <Link href="/dashboard">
          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-accent transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </button>
        </Link>
        
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">Conteúdo do Curso</h2>
          <p className="text-sm text-gray-500">{courseData.title}</p>
        </div>
      </div>

      <div>
        {courseData.modules.map((module: CourseModule) => (
          <ModuleItem
            key={module.id}
            module={module}
            currentLessonId={currentLessonId}
            onLessonClick={onLessonClick}
          />
        ))}
      </div>
    </aside>
  );
}

export default function LessonPage({ params }: { params: { courseId: string; lessonId: string } }) {
  const [activeTab, setActiveTab] = useState<"description" | "materials" | "comments">("description");
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  // Buscar comentários
  useEffect(() => {
    async function loadComments() {
      setIsLoadingComments(true);
      const data = await getCommentsByLessonId(params.lessonId);
      setComments(data);
      setIsLoadingComments(false);
    }
    loadComments();
  }, [params.lessonId]);

  const handleLessonClick = (lessonId: string) => {
    console.log("Navegar para aula:", lessonId);
    // Implementar navegação real
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Video Player */}
        <div className={cn(
          "bg-black transition-all duration-300",
          isTheaterMode ? "p-0" : "p-4 lg:p-6"
        )}>
          <div className={cn(
            "mx-auto transition-all duration-300",
            isTheaterMode ? "max-w-full" : "max-w-6xl"
          )}>
            <VideoPlayer 
              url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              onTheaterModeChange={setIsTheaterMode}
              autoPlay={false}
            />
            
            {/* Lesson Title - Hide in theater mode */}
            {!isTheaterMode && (
              <div className="mt-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  {currentLesson.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{currentLesson.duration}</span>
                  <span>•</span>
                  <span>{courseData.title}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs and Content - Hide in theater mode */}
        {!isTheaterMode && (
          <div className="flex-1 bg-background">
            <div className="max-w-6xl mx-auto">
              {/* Tabs */}
              <div className="border-b border-[#1F1F1F] flex gap-8 px-4 lg:px-6">
                <button
                  onClick={() => setActiveTab("description")}
                  className={cn(
                    "py-4 border-b-2 font-medium transition-colors",
                    activeTab === "description"
                      ? "border-accent text-accent"
                      : "border-transparent text-gray-500 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Descrição
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("materials")}
                  className={cn(
                    "py-4 border-b-2 font-medium transition-colors",
                    activeTab === "materials"
                      ? "border-accent text-accent"
                      : "border-transparent text-gray-500 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Materiais
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("comments")}
                  className={cn(
                    "py-4 border-b-2 font-medium transition-colors",
                    activeTab === "comments"
                      ? "border-accent text-accent"
                      : "border-transparent text-gray-500 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Comentários
                  </div>
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-4 lg:p-6">
                {activeTab === "description" && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-foreground">Sobre esta aula</h2>
                    <p className="text-foreground-muted leading-relaxed">
                      {currentLesson.description}
                    </p>
                  </div>
                )}

                {activeTab === "materials" && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-foreground">Materiais de Apoio</h2>
                    <div className="space-y-3">
                      {currentLesson.materials.map((material) => (
                        <div
                          key={material.id}
                          className="flex items-center justify-between p-4 bg-[#121212] border border-[#1F1F1F] rounded-lg hover:border-accent transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-accent" />
                            <div>
                              <p className="text-foreground font-medium">{material.name}</p>
                              <p className="text-xs text-gray-500">{material.size}</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-accent hover:bg-accent-light text-background rounded-lg transition-colors text-sm font-medium">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "comments" && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      Comentários {!isLoadingComments && `(${comments.length})`}
                    </h2>
                    
                    {isLoadingComments ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
                      </div>
                    ) : (
                      <CommentsList lessonId={params.lessonId} initialComments={comments} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Course Sidebar - Hide in theater mode */}
      {!isTheaterMode && (
        <CourseSidebar
          courseData={courseData}
          currentLessonId={params.lessonId}
          onLessonClick={handleLessonClick}
        />
      )}
    </div>
  );
}
