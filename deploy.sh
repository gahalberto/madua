#!/bin/bash

# Script de Deploy para VPS - Madua Platform
# Este script automatiza o processo de build e restart da aplicação

echo "🚀 Iniciando processo de deploy..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Pull das últimas mudanças
echo -e "${YELLOW}📥 Baixando últimas mudanças do repositório...${NC}"
git pull origin main || {
  echo -e "${RED}❌ Erro ao fazer pull do repositório${NC}"
  exit 1
}

# 2. Instalar/atualizar dependências
echo -e "${YELLOW}📦 Instalando dependências...${NC}"
npm install || {
  echo -e "${RED}❌ Erro ao instalar dependências${NC}"
  exit 1
}

# 3. Executar migrações do Prisma
echo -e "${YELLOW}🗄️  Executando migrações do banco de dados...${NC}"
npx prisma migrate deploy || {
  echo -e "${RED}❌ Erro ao executar migrações${NC}"
  exit 1
}

# 4. Gerar Prisma Client
echo -e "${YELLOW}🔧 Gerando Prisma Client...${NC}"
npx prisma generate || {
  echo -e "${RED}❌ Erro ao gerar Prisma Client${NC}"
  exit 1
}

# 5. Limpar build anterior
echo -e "${YELLOW}🧹 Limpando build anterior...${NC}"
rm -rf .next

# 6. Fazer build da aplicação
echo -e "${YELLOW}🏗️  Construindo aplicação...${NC}"
npm run build || {
  echo -e "${RED}❌ Erro ao fazer build da aplicação${NC}"
  exit 1
}

# 7. Verificar se o diretório standalone foi criado
if [ ! -d ".next/standalone" ]; then
  echo -e "${RED}❌ Erro: Diretório .next/standalone não foi criado${NC}"
  echo -e "${YELLOW}Verifique se 'output: standalone' está configurado no next.config.mjs${NC}"
  exit 1
fi

# 8. Copiar arquivos estáticos necessários
echo -e "${YELLOW}📋 Copiando arquivos estáticos...${NC}"
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/

# 9. Reiniciar aplicação com PM2
echo -e "${YELLOW}🔄 Reiniciando aplicação com PM2...${NC}"
pm2 restart madua-platform || pm2 start ecosystem.config.js

# 10. Verificar status
echo -e "${YELLOW}📊 Verificando status da aplicação...${NC}"
pm2 status madua-platform

echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo -e "${GREEN}🌐 Aplicação rodando em: https://madua.com.br${NC}"

# Mostrar logs recentes
echo -e "\n${YELLOW}📝 Últimos logs:${NC}"
pm2 logs madua-platform --lines 20 --nostream
