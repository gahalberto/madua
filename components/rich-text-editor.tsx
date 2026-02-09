'use client';

import { useState } from 'react';
import { Eye, Code } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) + before + selectedText + after + value.substring(end);

    onChange(newText);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-zinc-800 bg-black/30">
        {/* Mode Switcher */}
        <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              mode === 'edit'
                ? 'bg-[#D4AF37] text-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4 inline mr-1" />
            Editar
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              mode === 'preview'
                ? 'bg-[#D4AF37] text-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-1" />
            Preview
          </button>
        </div>

        <div className="w-px h-6 bg-zinc-800" />

        {/* Formatting Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => insertMarkdown('<h2>', '</h2>')}
            className="px-3 py-1 text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
            title="Título"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('<h3>', '</h3>')}
            className="px-3 py-1 text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
            title="Subtítulo"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('<strong>', '</strong>')}
            className="px-3 py-1 text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
            title="Negrito"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('<em>', '</em>')}
            className="px-3 py-1 text-sm italic text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
            title="Itálico"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('<p>', '</p>')}
            className="px-3 py-1 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
            title="Parágrafo"
          >
            P
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('<ul>\n  <li>', '</li>\n</ul>')}
            className="px-3 py-1 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
            title="Lista"
          >
            UL
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('<a href="URL">', '</a>')}
            className="px-3 py-1 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
            title="Link"
          >
            🔗
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      {mode === 'edit' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[500px] bg-zinc-900 text-white p-4 focus:outline-none font-mono text-sm resize-y"
          spellCheck={false}
        />
      ) : (
        <div
          className="min-h-[500px] p-4 prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8
            prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
            prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-[#D4AF37] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white prose-strong:font-bold
            prose-em:text-zinc-300 prose-em:italic
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
            prose-li:text-zinc-300 prose-li:mb-2"
          dangerouslySetInnerHTML={{ __html: value || '<p class="text-zinc-500">Sem conteúdo para preview</p>' }}
        />
      )}

      {/* Help Text */}
      <div className="p-3 border-t border-zinc-800 bg-black/30">
        <p className="text-xs text-zinc-500">
          💡 Use tags HTML: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;, etc.
          Alterna entre Editar e Preview para ver o resultado final.
        </p>
      </div>
    </div>
  );
}
