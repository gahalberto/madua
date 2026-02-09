'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { Archetype } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getRoutineTasks() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error('Não autenticado');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      routineTasks: {
        orderBy: { order: 'asc' },
      },
    },
  });

  return user?.routineTasks || [];
}

export async function getTodayRoutineTasks() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error('Não autenticado');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const tasks = await prisma.routineTask.findMany({
    where: {
      userId: user.id,
    },
    orderBy: { order: 'asc' },
  });

  return tasks;
}

export async function createRoutineTask(data: {
  title: string;
  description?: string;
  archetype: Archetype;
  beforeRitual?: string;
  afterRitual?: string;
  points?: number;
  order?: number;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error('Não autenticado');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const task = await prisma.routineTask.create({
    data: {
      ...data,
      userId: user.id,
    },
  });

  revalidatePath('/dashboard');
  return task;
}

export async function updateRoutineTask(
  taskId: string,
  data: {
    title?: string;
    description?: string;
    archetype?: Archetype;
    beforeRitual?: string;
    afterRitual?: string;
    points?: number;
    order?: number;
  }
) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error('Não autenticado');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  // Verificar se a task pertence ao usuário
  const existingTask = await prisma.routineTask.findUnique({
    where: { id: taskId },
  });

  if (!existingTask || existingTask.userId !== user.id) {
    throw new Error('Tarefa não encontrada ou não autorizada');
  }

  const task = await prisma.routineTask.update({
    where: { id: taskId },
    data,
  });

  revalidatePath('/dashboard');
  return task;
}

export async function deleteRoutineTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error('Não autenticado');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  // Verificar se a task pertence ao usuário
  const existingTask = await prisma.routineTask.findUnique({
    where: { id: taskId },
  });

  if (!existingTask || existingTask.userId !== user.id) {
    throw new Error('Tarefa não encontrada ou não autorizada');
  }

  await prisma.routineTask.delete({
    where: { id: taskId },
  });

  revalidatePath('/dashboard');
}

export async function completeRoutineTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error('Não autenticado');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  // Verificar se a task pertence ao usuário
  const existingTask = await prisma.routineTask.findUnique({
    where: { id: taskId },
  });

  if (!existingTask || existingTask.userId !== user.id) {
    throw new Error('Tarefa não encontrada ou não autorizada');
  }

  const task = await prisma.routineTask.update({
    where: { id: taskId },
    data: {
      completedAt: new Date(),
    },
  });

  revalidatePath('/dashboard');
  return task;
}

export async function uncompleteRoutineTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error('Não autenticado');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  // Verificar se a task pertence ao usuário
  const existingTask = await prisma.routineTask.findUnique({
    where: { id: taskId },
  });

  if (!existingTask || existingTask.userId !== user.id) {
    throw new Error('Tarefa não encontrada ou não autorizada');
  }

  const task = await prisma.routineTask.update({
    where: { id: taskId },
    data: {
      completedAt: null,
    },
  });

  revalidatePath('/dashboard');
  return task;
}

export async function getArchetypeStats() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error('Não autenticado');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const completedTasks = await prisma.routineTask.findMany({
    where: {
      userId: user.id,
      completedAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  const stats = {
    KING: 0,
    WARRIOR: 0,
    MAGE: 0,
  };

  completedTasks.forEach((task) => {
    stats[task.archetype] += task.points;
  });

  return stats;
}
