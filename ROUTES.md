# Rotas da Plataforma MADUA

## Estrutura de Rotas

### Rotas Públicas
- `/` - Página inicial

### Rotas com Layout Principal (Sidebar + Header)
- `/dashboard` - Dashboard estilo Netflix
- `/aulas` - Lista de cursos
- `/comunidade` - Comunidade (a implementar)
- `/configuracoes` - Configurações (a implementar)

### Rotas de Visualização de Aula (Full Screen)
- `/courses/[courseId]/lessons/[lessonId]` - Player de vídeo da aula

## Exemplos de URLs

### Acessar uma aula específica:
```
/courses/1/lessons/2
/courses/fundamentos-selva/lessons/equipamentos-essenciais
```

### Teste rápido:
- Dashboard: http://localhost:3000/dashboard
- Aula: http://localhost:3000/courses/1/lessons/2
