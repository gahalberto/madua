module.exports = {
  apps: [
    {
      name: 'madua-platform',
      // Usar o servidor standalone do Next.js para melhor performance
      script: '.next/standalone/server.js',
      instances: 1,
      autorestart: true,
      watch: false, // Em produção, não queremos reiniciar a cada ficheiro alterado
      max_memory_restart: '1G', // Reinicia a app se exceder 1GB de memória (segurança para VPS)
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        // Importante: definir o hostname para o servidor escutar
        HOSTNAME: '0.0.0.0',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};