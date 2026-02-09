# VideoPlayer Component - Documentação

## 🎥 Visão Geral

Componente de video player minimalista e profissional para a plataforma MADUA, construído com `react-player` e completamente customizado com controles elegantes em dourado (#D4AF37).

## ✨ Funcionalidades

### Controles Básicos
- ▶️ **Play/Pause**: Clique no vídeo ou use espaço/K
- 🔊 **Volume**: Controle deslizante com hover + botão mute (M)
- ⏱️ **Barra de progresso**: Dourada (#D4AF37) com thumb invisível até hover
- ⏰ **Tempo**: Atual / Total formatado (MM:SS ou HH:MM:SS)

### Modos de Visualização
- 🎭 **Theater Mode (T)**: Expande o vídeo e oculta sidebar lateral
- 🖥️ **Fullscreen (F)**: Modo tela cheia nativo
- 👁️ **Auto-hide**: Controles desaparecem após 3s quando reproduzindo

### Velocidade de Reprodução
- ⚙️ Menu de configurações com opções: 0.5x, 0.75x, 1x, 1.25x, 1.5x, 1.75x, 2x
- Indicador visual da velocidade selecionada

### Atalhos de Teclado
| Tecla | Ação |
|-------|------|
| `Espaço` / `K` | Play/Pause |
| `F` | Fullscreen |
| `T` | Theater Mode |
| `M` | Mute/Unmute |
| `←` | Voltar 5 segundos |
| `→` | Avançar 5 segundos |

## 📦 Instalação

```bash
npm install react-player
```

## 🔨 Uso Básico

```tsx
import { VideoPlayer } from '@/components/video-player';

export default function MyPage() {
  return (
    <VideoPlayer 
      url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      autoPlay={false}
    />
  );
}
```

## 🎨 Props

```typescript
interface VideoPlayerProps {
  // URL do vídeo (suporta YouTube, Vimeo, arquivos MP4, etc)
  url: string;
  
  // Callback quando Theater Mode é ativado/desativado
  onTheaterModeChange?: (isTheaterMode: boolean) => void;
  
  // Iniciar reprodução automaticamente
  autoPlay?: boolean;
  
  // Classes CSS adicionais
  className?: string;
}
```

## 🎭 Theater Mode Integration

O Theater Mode foi integrado à página de aula para criar uma experiência imersiva:

```tsx
export default function LessonPage() {
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  return (
    <div className="flex">
      <VideoPlayer 
        url="video.mp4"
        onTheaterModeChange={setIsTheaterMode}
      />
      
      {/* Sidebar oculta em Theater Mode */}
      {!isTheaterMode && <Sidebar />}
    </div>
  );
}
```

**Efeitos do Theater Mode:**
- ✅ Vídeo expande para largura total
- ✅ Remove padding do container
- ✅ Oculta sidebar de cursos
- ✅ Oculta título e tabs da aula
- ✅ Foco total no conteúdo

## 🎨 Customização de Cores

A barra de progresso e elementos interativos usam a cor dourada da MADUA:

```css
/* Cor principal - Dourado MADUA */
#D4AF37

/* Aplicado em: */
- Barra de progresso (preenchimento)
- Thumb da barra de progresso (hover)
- Volume slider (preenchimento)
- Botões em hover
- Play button overlay
- Velocidade selecionada
```

Para alterar a cor, substitua `#D4AF37` no arquivo:
- `components/video-player.tsx`
- Variável `accent` no Tailwind: `tailwind.config.ts`

## 🎯 Plataformas Suportadas

O `react-player` suporta:

✅ **YouTube**
```tsx
<VideoPlayer url="https://www.youtube.com/watch?v=VIDEO_ID" />
```

✅ **Vimeo**
```tsx
<VideoPlayer url="https://vimeo.com/VIDEO_ID" />
```

✅ **Arquivos MP4/WEBM**
```tsx
<VideoPlayer url="https://example.com/video.mp4" />
```

✅ **HLS (.m3u8)**
```tsx
<VideoPlayer url="https://example.com/stream.m3u8" />
```

✅ **DASH**
```tsx
<VideoPlayer url="https://example.com/manifest.mpd" />
```

## 🔧 Configuração Avançada

### Customizar configurações do YouTube

```tsx
<VideoPlayer 
  url="youtube-url"
  config={{
    youtube: {
      playerVars: {
        modestbranding: 1,    // Remove logo YouTube
        controls: 0,           // Oculta controles padrão
        disablekb: 1,         // Desabilita atalhos padrão
        fs: 0,                // Remove botão fullscreen
        rel: 0,               // Sem vídeos relacionados
      }
    }
  }}
/>
```

### Player responsivo com aspect ratio

```tsx
<div className="aspect-video w-full max-w-4xl mx-auto">
  <VideoPlayer url="..." />
</div>
```

### Theater mode com animação suave

```tsx
<div className={cn(
  "transition-all duration-300",
  isTheaterMode ? "max-w-full p-0" : "max-w-6xl p-6"
)}>
  <VideoPlayer 
    url="..."
    onTheaterModeChange={setIsTheaterMode}
  />
</div>
```

## 🎬 Exemplo Completo

```tsx
'use client';

import { useState } from 'react';
import { VideoPlayer } from '@/components/video-player';

export default function CourseLesson() {
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Container do vídeo */}
      <div className={cn(
        "flex-1 bg-black transition-all",
        isTheaterMode ? "p-0" : "p-6"
      )}>
        <VideoPlayer 
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          onTheaterModeChange={setIsTheaterMode}
          autoPlay={false}
          className="rounded-lg overflow-hidden"
        />
        
        {!isTheaterMode && (
          <div className="mt-4 text-white">
            <h1 className="text-3xl font-bold">Título da Aula</h1>
            <p className="text-gray-400">12:45 • Fundamentos</p>
          </div>
        )}
      </div>

      {/* Sidebar (oculta em theater mode) */}
      {!isTheaterMode && (
        <aside className="w-96 bg-gray-900 overflow-y-auto">
          <h2 className="p-4 font-bold text-white">Conteúdo do Curso</h2>
          {/* Lista de aulas */}
        </aside>
      )}
    </div>
  );
}
```

## 🐛 Troubleshooting

### Vídeo não carrega
- Verifique se a URL é válida
- Para YouTube, certifique-se que o vídeo não tem restrições de embed
- Para arquivos, verifique CORS headers

### Controles não aparecem
- Verifique se `showControls` está true
- Mouse deve estar sobre o vídeo
- Em mobile, toque no vídeo

### Theater mode não funciona
- Certifique-se de passar `onTheaterModeChange`
- Implemente a lógica de hide/show na sidebar

### Barra de progresso não funciona
- Verifique se o vídeo tem `duration` válida
- Alguns streams ao vivo não têm duração

## 📱 Mobile

O player é totalmente responsivo:
- Controles otimizados para touch
- Fullscreen nativo em mobile
- Volume controlado pelo sistema
- Landscape automático em fullscreen

## 🚀 Performance

**Otimizações implementadas:**
- ✅ Lazy loading do react-player
- ✅ Auto-hide dos controles (economia de CPU)
- ✅ Debounce em eventos de seek
- ✅ CSS em vez de JS para animações
- ✅ Memoização de callbacks

## 🎨 Estilo Minimalista

O design segue princípios minimalistas:
- **Controles apenas essenciais**: Play, Volume, Progresso, Settings, Theater, Fullscreen
- **Auto-hide inteligente**: Controles desaparecem durante reprodução
- **Feedback visual sutil**: Hover states com cor dourada
- **Typography clean**: Sans-serif, tamanhos hierárquicos
- **Espaçamento generoso**: Padding e gap consistentes

## 🔐 Integração com Premium

O VideoPlayer pode ser envolvido no `<AccessGate>` para controle premium:

```tsx
import { AccessGate } from '@/components/premium-badge';

<AccessGate 
  isPremium={lesson.isPremium}
  courseId={course.id}
  courseName={course.title}
>
  <VideoPlayer url={lesson.videoUrl} />
</AccessGate>
```

## 📊 Métricas Sugeridas

Eventos úteis para tracking:
- `onPlay` - Início de reprodução
- `onPause` - Pausa
- `onEnded` - Conclusão do vídeo
- `onProgress` - Acompanhar % assistido
- `onDuration` - Duração total

Exemplo:
```tsx
<VideoPlayer 
  url="..."
  onProgress={(state) => {
    // Salvar progresso no banco
    if (state.played > 0.9) {
      markLessonAsCompleted();
    }
  }}
/>
```

---

**Desenvolvido para MADUA** - Video player profissional com Theater Mode e controles customizados em dourado.
