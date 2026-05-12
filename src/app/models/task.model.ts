export interface Task {
  id: string;
  title: string;
  completed: boolean;
  /** Categoría (Fase 2). */
  categoryId?: string | null;
}
