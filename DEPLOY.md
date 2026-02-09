# 🚀 Guia de Deploy - Madua Platform

## Problema Resolvido

Os arquivos estáticos (CSS, JS chunks) estavam retornando 404 no VPS porque o Next.js não estava configurado corretamente para deploy em produção com standalone build.

## Solução Implementada

### 1. Configuração do Next.js (`next.config.mjs`)

Adicionamos `output: 'standalone'` que:
- Gera um servidor otimizado em `.next/standalone/`
- Reduz o tamanho do deploy
- Inclui apenas dependências necessárias
- Melhora performance e tempo de inicialização

### 2. Script de Deploy Automatizado (`deploy.sh`)

Criamos um script que automatiza todo o processo:
- Pull do repositório
- Instalação de dependências
- Migrações do banco
- Build da aplicação
- Cópia de arquivos estáticos
- Restart do PM2

### 3. Configuração PM2 Atualizada (`ecosystem.config.js`)

Ajustamos para usar o servidor standalone:
- Executa `.next/standalone/server.js` diretamente
- Melhor performance que `npm start`
- Logs configurados
- Variáveis de ambiente corretas

## 📋 Processo de Deploy no VPS

### Primeira vez (Setup Inicial)

```bash
# 1. Conectar no VPS
ssh usuario@madua.com.br

# 2. Navegar para o diretório do projeto
cd /caminho/do/projeto/madua

# 3. Fazer pull das mudanças (incluindo os novos arquivos)
git pull origin main

# 4. Executar o script de deploy
./deploy.sh
```

### Deploys Subsequentes

Simplesmente execute:

```bash
ssh usuario@madua.com.br
cd /caminho/do/projeto/madua
./deploy.sh
```

## 🔧 Comandos Úteis PM2

```bash
# Ver status da aplicação
pm2 status madua-platform

# Ver logs em tempo real
pm2 logs madua-platform

# Reiniciar aplicação
pm2 restart madua-platform

# Parar aplicação
pm2 stop madua-platform

# Ver informações detalhadas
pm2 show madua-platform

# Ver uso de memória e CPU
pm2 monit
```

## 📁 Estrutura de Build

Após o build, a estrutura fica assim:

```
.next/
├── standalone/           # Servidor otimizado
│   ├── server.js        # Script principal
│   ├── .next/
│   │   └── static/      # Copiado pelo deploy.sh
│   └── public/          # Copiado pelo deploy.sh
├── static/              # Assets estáticos (copiados para standalone)
└── cache/               # Cache de build
```

## 🌐 Configuração Nginx (se aplicável)

Se estiver usando Nginx como proxy reverso, a configuração deve ser:

```nginx
server {
    listen 80;
    server_name madua.com.br www.madua.com.br;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache para arquivos estáticos
    location /_next/static {
        proxy_pass http://localhost:3001;
        proxy_cache_valid 200 60m;
        proxy_cache_bypass $http_cache_control;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # SSL configuração (se usando HTTPS)
    # listen 443 ssl;
    # ssl_certificate /etc/letsencrypt/live/madua.com.br/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/madua.com.br/privkey.pem;
}
```

Depois de alterar o Nginx:
```bash
sudo nginx -t            # Testar configuração
sudo systemctl reload nginx
```

## ⚠️ Troubleshooting

### Problema: Arquivos ainda retornam 404

**Solução:**
```bash
# Verificar se os arquivos estáticos foram copiados
ls -la .next/standalone/.next/static/
ls -la .next/standalone/public/

# Se estiverem vazios, copiar manualmente:
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/

# Reiniciar PM2
pm2 restart madua-platform
```

### Problema: Erro "Cannot find module"

**Solução:**
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Limpar build e reconstruir
rm -rf .next
npm run build
./deploy.sh
```

### Problema: Aplicação não inicia

**Solução:**
```bash
# Ver logs do PM2
pm2 logs madua-platform --lines 100

# Verificar se a porta 3001 está disponível
sudo lsof -i :3001

# Se necessário, matar processo na porta
sudo kill -9 $(sudo lsof -t -i:3001)

# Reiniciar
pm2 restart madua-platform
```

### Problema: Variáveis de ambiente não carregadas

**Solução:**
```bash
# Verificar se o arquivo .env existe no VPS
cat .env

# Garantir que as variáveis estão corretas
# Especialmente DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET

# Se alterar .env, precisa rebuild:
npm run build
pm2 restart madua-platform
```

## 📊 Monitoramento

### Verificar saúde da aplicação:

```bash
# Status geral
pm2 status

# Uso de recursos
pm2 monit

# Logs de erro
pm2 logs madua-platform --err

# Último restart
pm2 show madua-platform
```

### Verificar no navegador:

1. Abrir DevTools (F12)
2. Aba Network
3. Recarregar página (Ctrl+R)
4. Verificar se todos os arquivos `/_next/static/` retornam 200

## 🎯 Checklist de Deploy

Antes de fazer deploy, verificar:

- [ ] Código commitado e pushado
- [ ] Variáveis de ambiente configuradas no VPS
- [ ] Banco de dados acessível
- [ ] Migrações Prisma criadas e testadas localmente
- [ ] Build local funciona (`npm run build && npm start`)
- [ ] PM2 instalado no VPS (`npm install -g pm2`)

Durante o deploy:

- [ ] Executar `./deploy.sh` no VPS
- [ ] Verificar logs: `pm2 logs madua-platform`
- [ ] Testar site no navegador
- [ ] Verificar que não há erros 404 no console

## 📝 Notas Importantes

1. **Sempre faça backup do banco antes de fazer migrações em produção**
2. **Teste o build localmente antes de fazer deploy**
3. **Mantenha o .env seguro e nunca commite ele no Git**
4. **Use HTTPS em produção (Let's Encrypt gratuito)**
5. **Configure monitoramento (Uptime Robot, etc.)**

## 🆘 Suporte

Se ainda tiver problemas após seguir este guia:

1. Verificar logs detalhados: `pm2 logs madua-platform --lines 200`
2. Verificar logs do Nginx (se aplicável): `sudo tail -f /var/log/nginx/error.log`
3. Testar conexão com banco: `npx prisma db pull`
4. Verificar porta: `curl http://localhost:3001`

---

**Última atualização:** $(date +%Y-%m-%d)
