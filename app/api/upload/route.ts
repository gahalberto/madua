import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    console.log('=== INICIANDO UPLOAD ===');
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('Nenhum arquivo enviado');
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    console.log('Arquivo recebido:', {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB (${file.size} bytes)`,
      type: file.type,
    });

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      console.error('Tipo de arquivo inválido:', file.type);
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use apenas JPG, PNG, WEBP ou GIF' },
        { status: 400 }
      );
    }

    // Validar tamanho (máximo 10MB antes da compressão)
    const maxSizeOriginal = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeOriginal) {
      console.error('Arquivo muito grande');
      return NextResponse.json(
        { error: 'Arquivo muito grande. Tamanho máximo: 10MB' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log('Buffer criado:', {
      size: `${(buffer.length / 1024 / 1024).toFixed(2)}MB (${buffer.length} bytes)`,
    });

    // Validar se buffer está vazio
    if (buffer.length === 0) {
      console.error('Buffer vazio ou corrompido');
      return NextResponse.json(
        { error: 'Arquivo corrompido ou vazio. Tente novamente.' },
        { status: 400 }
      );
    }

    // Se o arquivo for muito grande, avisar ao cliente
    if (buffer.length > 5 * 1024 * 1024) {
      console.warn(`Arquivo grande detectado: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);
    }

    // Validar tamanho final (máximo 8MB)
    const maxSizeFinal = 8 * 1024 * 1024;
    if (buffer.length > maxSizeFinal) {
      console.error(`Arquivo excede 8MB: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);
      return NextResponse.json(
        { error: 'Arquivo muito grande. Por favor, comprima a imagem antes de enviar (máximo 8MB).' },
        { status: 400 }
      );
    }

    // Criar nome único para o arquivo
    const timestamp = Date.now();
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    const cleanName = nameWithoutExt
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 50) || 'image';
    
    const fileName = `${timestamp}-${cleanName}.${ext}`;

    // Criar diretório se não existir
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'receitas');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Salvar arquivo
    const filePath = join(uploadDir, fileName);
    console.log('Salvando arquivo em:', filePath);
    await writeFile(filePath, buffer);
    console.log('Arquivo salvo com sucesso');

    // Verificar se arquivo foi realmente salvo
    try {
      const stats = await stat(filePath);
      console.log('Arquivo verificado após salvar:', {
        size: `${(stats.size / 1024).toFixed(2)}KB (${stats.size} bytes)`,
        isFile: stats.isFile(),
      });
    } catch (err) {
      console.error('Erro ao verificar arquivo salvo:', err);
    }

    // Retornar URL pública
    const publicUrl = `/uploads/receitas/${fileName}`;
    
    console.log('✓ Upload concluído com sucesso:', {
      originalName: file.name,
      savedAs: fileName,
      originalSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      bufferSize: `${(buffer.length / 1024 / 1024).toFixed(2)}MB`,
      bufferSizeBytes: buffer.length,
      path: filePath,
      publicUrl,
    });
    console.log('=== FIM UPLOAD ===\n');

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao fazer upload';
    return NextResponse.json(
      { error: `Erro ao fazer upload do arquivo: ${errorMessage}` },
      { status: 500 }
    );
  }
}
