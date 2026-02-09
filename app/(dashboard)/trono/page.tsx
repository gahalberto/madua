import { getTodayRoutineTasks, getArchetypeStats } from '@/app/actions/routine';
import RoutineManager from '@/components/routine-manager';

export default async function TronoPage() {
  const tasks = await getTodayRoutineTasks();
  const stats = await getArchetypeStats();

  return (
    <div className="min-h-screen bg-[#050505] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-5xl md:text-6xl text-[#F5F5F5] mb-4">O Trono</h1>
          <p className="text-xl text-gray-400">
            Comando diário da sua Soberania. Ative seus Arquétipos através de ações conscientes.
          </p>
        </div>

        {/* Routine Manager (Client Component) */}
        <RoutineManager initialTasks={tasks} initialStats={stats} />
      </div>
    </div>
  );
}
