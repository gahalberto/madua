# Guia de Debug - Upload de Imagens

## Resumo das Melhorias Implementadas

### 1. **Cliente (components/image-upload.tsx)**
- ✅ Timeout de 5 segundos para canvas.toBlob (evita travar)
- ✅ Validação robusta do blob antes de enviar
- ✅ Logging detalhado com unidades corretas (KB, MB)
- ✅ Fallback automático para arquivo original se compressão falhar
- ✅ Try-catch melhorado em handleFileChange

### 2. **Servidor (app/api/upload/route.ts)**
- ✅ Logging detalhado de todo o processo
- ✅ Validação de buffer vazio após leitura
- ✅ Verificação de arquivo salvo (stat)
- ✅ Unidades corretas em todos os logs
- ✅ Melhor tratamento de erros

## Como Testar

### Teste 1: Upload de Imagem Grande (>2MB)
1. Abra uma página com upload (ex: admin/receitas)
2. Abra DevTools (F12 ou Cmd+Option+I)
3. Vá para "Console" para ver logs detalhados
4. Selecione uma imagem grande (>2MB)
5. Observe os logs:
   - Browser: "Comprimindo imagem..."
   - Browser: "Imagem comprimida: XXX.XXKB"
   - Server: "=== INICIANDO UPLOAD ===" 
   - Server: Buffer size e confirmação de salvamento

### Teste 2: Upload de Imagem Pequena (<2MB)
1. Selecione uma imagem pequena
2. Browser log: "Imagem pequena, enviando sem compressão"
3. Server log: Confirmação de upload

### Teste 3: Verificar Arquivo Salvo
1. Na console do servidor (terminal), procure:
   ```
   ✓ Upload concluído com sucesso: {
     originalSize: "X.XXMB",
     bufferSize: "X.XXMB",
     bufferSizeBytes: XXXXX,
     publicUrl: "/uploads/receitas/..."
   }
   ```
2. Confirme que `bufferSizeBytes` NÃO é 0
3. Confirme que `publicUrl` está certo

### Teste 4: Carregar Imagem no Browser
1. Após upload, procure pela imagem no HTML
2. Clique em Network no DevTools
3. Procure pelo arquivo em `/uploads/receitas/...`
4. Confirme que:
   - Status: 200 OK
   - Content-Type: image/...
   - Content-Length: > 0

## Troubleshooting

**Problema: 404 no upload**
- Verificar logs do servidor: bufferSizeBytes deve ser > 0
- Se bufferSizeBytes = 0, compressão falhou silenciosamente
- Check se o diretório `/public/uploads/receitas/` existe

**Problema: Imagem não carrega após upload**
- DevTools → Network → procure pela imagem
- Se 404: arquivo não foi salvo corretamente
- Se 200 mas não mostra: problema de CORS ou caminho errado

**Problema: Compressão muito lenta**
- Timeout após 5 segundos (retorna arquivo original)
- Check logs do browser para ver se compressão foi concluída

## Logs Esperados no Browser (Console)

```
Iniciando upload: {
  name: "photo.jpg",
  size: "3.45MB",
  type: "image/jpeg"
}

Comprimindo imagem: photo.jpg (3.45MB)

Imagem comprimida: 450.25KB (460856 bytes)

Enviando para servidor: {
  fileName: "photo.jpg",
  size: "450.25KB",
  type: "image/jpeg"
}

Upload bem-sucedido: {
  url: "/uploads/receitas/1707123456-photo.jpg",
  fileName: "1707123456-photo.jpg"
}
```

## Logs Esperados no Servidor

```
=== INICIANDO UPLOAD ===

Arquivo recebido: {
  name: "photo.jpg",
  size: "3.45MB (3621897 bytes)",
  type: "image/jpeg"
}

Buffer criado: {
  size: "3.45MB (3621897 bytes)"
}

Salvando arquivo em: /Users/.../public/uploads/receitas/1707123456-photo.jpg
Arquivo salvo com sucesso

Arquivo verificado após salvar: {
  size: "3.45KB (3540 bytes)",
  isFile: true
}

✓ Upload concluído com sucesso: {
  originalName: "photo.jpg",
  savedAs: "1707123456-photo.jpg",
  originalSize: "3.45MB",
  bufferSize: "3.45MB",
  bufferSizeBytes: 3621897,
  path: "...",
  publicUrl: "/uploads/receitas/1707123456-photo.jpg"
}

=== FIM UPLOAD ===
```

## Proximos Passos

Se tudo funcionar:
1. ✅ Comprimir imagens grandes no browser
2. ✅ Salvar no servidor com nome único e timestamp
3. ✅ Retornar URL pública
4. ⏭️ Integrar PreCheckoutModal na página de assinatura
5. ⏭️ Testar fluxo completo de lead capture

---
**Última atualização:** 09 de Fevereiro de 2024
