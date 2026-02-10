import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use apenas JPG, PNG, WEBP ou GIF' },
        { status: 400 }
      );
    }

    // Validar tamanho (máximo 10MB antes da compressão)
    const maxSizeOriginal = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeOriginal) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Tamanho máximo: 10MB' },
        { status: 400 }
      );
    }

    let buffer = Buffer.from(await file.arrayBuffer());

    // Se o arquivo for muito grande, avisar ao cliente
    if (buffer.length > 5 * 1024 * 1024) {
      console.warn(`Arquivo grande: ${file.name} (${Math.round(buffer.length / 1024 / 1024)}MB). Recomenda-se comprimir antes de enviar.`);
    }

    // Validar tamanho final (máximo 8MB)
    const maxSizeFinal = 8 * 1024 * 1024;
    if (buffer.length > maxSizeFinal) {
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
    await writeFile(filePath, buffer);

    // Retornar URL pública
    const publicUrl = `/uploads/receitas/${fileName}`;
    
    console.log('Arquivo enviado com sucesso:', {
      originalName: file.name,
      savedAs: fileName,
      size: file.size,
      path: filePath,
      publicUrl
    });

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
