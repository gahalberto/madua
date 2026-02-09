'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer upload');
      }

      onChange(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload da imagem');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    } else {
      onChange('');
    }
  };

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-zinc-700 bg-zinc-800">
          <img
            src={value}
            alt="Upload preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            title="Remover imagem"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-zinc-700 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
            {uploading ? (
              <>
                <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mb-3" />
                <p className="text-sm text-zinc-400">A fazer upload...</p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-zinc-500 mb-3" />
                <p className="text-sm text-zinc-400 mb-1">
                  Clique para fazer upload ou arraste uma imagem
                </p>
                <p className="text-xs text-zinc-500">
                  JPG, PNG, WEBP ou GIF (máx. 5MB)
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400 flex items-center gap-2">
          <X className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}
