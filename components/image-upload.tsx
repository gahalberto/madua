'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
}

// Função para comprimir imagem no navegador
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onerror = () => {
      console.error('Erro ao ler arquivo');
      reject(new Error('Erro ao ler arquivo'));
    };
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onerror = () => {
        console.error('Erro ao carregar imagem');
        reject(new Error('Erro ao carregar imagem'));
      };
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Redimensionar se muito grande (máximo 1920px)
        const maxWidth = 1920;
        const maxHeight = 1920;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.warn('Não conseguiu obter contexto do canvas');
          resolve(file);
          return;
        }

        try {
          ctx.drawImage(img, 0, 0, width, height);
          
          let blobResolved = false;
          const timeout = setTimeout(() => {
            if (!blobResolved) {
              console.warn('Timeout na compressão, usando arquivo original');
              blobResolved = true;
              resolve(file);
            }
          }, 5000);
          
          canvas.toBlob(
            (blob) => {
              clearTimeout(timeout);
              if (blobResolved) return; // Já resolvido por timeout
              blobResolved = true;

              if (blob && blob.size > 0) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                console.log(
                  `Compressão bem-sucedida: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024).toFixed(2)}KB`
                );
                resolve(compressedFile);
              } else {
                console.warn('Blob vazio após compressão, usando arquivo original', {
                  blobSize: blob?.size || 0,
                  fileName: file.name,
                  originalSize: file.size,
                });
                resolve(file);
              }
            },
            'image/jpeg',
            0.85 // Qualidade 85%
          );
        } catch (error) {
          console.error('Erro ao desenhar imagem no canvas:', error);
          resolve(file);
        }
      };
    };
  });
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Iniciando upload:', {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      type: file.type,
    });

    setUploading(true);
    setError('');

    try {
      // Comprimir imagem se muito grande
      let fileToUpload = file;
      if (file.size > 2 * 1024 * 1024) {
        console.log(`Comprimindo imagem: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
        try {
          fileToUpload = await compressImage(file);
          console.log(`Imagem comprimida: ${(fileToUpload.size / 1024).toFixed(2)}KB (${fileToUpload.size} bytes)`);
        } catch (compressError) {
          console.warn('Falha na compressão, tentando enviar original:', compressError);
          fileToUpload = file;
        }
      } else {
        console.log(`Imagem pequena, enviando sem compressão: ${(file.size / 1024).toFixed(2)}KB`);
      }

      console.log('Enviando para servidor:', {
        fileName: fileToUpload.name,
        size: `${(fileToUpload.size / 1024).toFixed(2)}KB`,
        type: fileToUpload.type,
      });

      const formData = new FormData();
      formData.append('file', fileToUpload);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      // Verificar se é JSON
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Resposta inválida do servidor. Por favor, tente novamente.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer upload');
      }

      console.log('Upload bem-sucedido:', {
        url: data.url,
        fileName: data.fileName,
      });

      onChange(data.url);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao fazer upload da imagem';
      setError(errorMsg);
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
                  JPG, PNG, WEBP ou GIF (até 10MB - será comprimida automaticamente)
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
