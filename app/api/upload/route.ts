import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use apenas JPG, PNG, WEBP ou GIF' },
        { status: 400 }
      );
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Tamanho máximo: 5MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Criar nome único para o arquivo
    const timestamp = Date.now();
    // Extrair extensão
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    // Criar nome limpo a partir do nome original (sem extensão)
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    const cleanName = nameWithoutExt
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 50) || 'image'; // Fallback para 'image' se estiver vazio
    
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
    
    console.log('File uploaded successfully:', {
      originalName: file.name,
      savedAs: fileName,
      size: file.size,
      path: filePath,
      publicUrl
    });

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Erro ao fazer upload do arquivo' }, { status: 500 });
  }
}
