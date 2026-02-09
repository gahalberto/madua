// Exemplo de uso do ModuleCompletionToast
// Este código pode ser adicionado à página de aula quando detectar conclusão de módulo

import { ModuleCompletionToast, useModuleCompletion } from '@/components/module-completion-toast';

function ExemploUsoConclusaoModulo() {
  const { showToast, moduleName, closeToast } = useModuleCompletion();

  // Simular conclusão de módulo (você deve chamar isso quando detectar que todas as aulas foram completadas)
  /* Exemplo:
  const handleCompleteLesson = async (_lessonId: string) => {
    // Sua lógica existente para completar a aula...
    
    // Verificar se o módulo está completo
    const isModuleComplete = checkIfModuleIsComplete(); // Implementar esta função
    
    if (isModuleComplete) {
      celebrate('Módulo 1: Introdução à Sobrevivência');
    }
  };
  */

  return (
    <div>
      {/* Seu conteúdo da página */}
      
      {/* Toast de conclusão */}
      <ModuleCompletionToast 
        show={showToast}
        moduleName={moduleName}
        onClose={closeToast}
      />
    </div>
  );
}

// Função auxiliar para verificar se módulo está completo
export function checkIfModuleIsComplete() {
  // Implementar lógica:
  // 1. Buscar todas as aulas do módulo atual
  // 2. Verificar se todas estão marcadas como completas
  // 3. Retornar true/false
  return true; // placeholder
}

export default ExemploUsoConclusaoModulo;
