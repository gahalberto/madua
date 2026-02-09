module.exports = {
  apps: [
    {
      name: 'madua-platform',
      script: 'npm',
      args: 'start', // Executa o comando "next start" definido no package.json
      instances: 1,
      autorestart: true,
      watch: false, // Em produção, não queremos reiniciar a cada ficheiro alterado
      max_memory_restart: '1G', // Reinicia a app se exceder 1GB de memória (segurança para VPS)
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};