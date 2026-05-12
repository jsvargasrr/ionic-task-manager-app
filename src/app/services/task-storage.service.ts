import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';

const STORAGE_KEY = 'tm_tasks';

@Injectable({ providedIn: 'root' })
export class TaskStorageService {
  private readonly tasksSubject = new BehaviorSubject<Task[]>([]);

  readonly tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor(private readonly storage: Storage) {}

  async init(): Promise<void> {
    await this.storage.create();
    const stored = await this.storage.get(STORAGE_KEY);
    const list: Task[] = Array.isArray(stored) ? stored : [];
    this.tasksSubject.next(list);
  }

  private async persist(): Promise<void> {
    await this.storage.set(STORAGE_KEY, this.tasksSubject.getValue());
  }

  async addTask(title: string): Promise<void> {
    const t = title.trim();
    if (!t) {
      return;
    }
    const task: Task = {
      id: this.newId(),
      title: t,
      completed: false,
      categoryId: null,
    };
    this.tasksSubject.next([task, ...this.tasksSubject.getValue()]);
    await this.persist();
  }

  async setCompleted(id: string, completed: boolean): Promise<void> {
    const next = this.tasksSubject
      .getValue()
      .map((x) => (x.id === id ? { ...x, completed } : x));
    this.tasksSubject.next(next);
    await this.persist();
  }

  async removeTask(id: string): Promise<void> {
    this.tasksSubject.next(
      this.tasksSubject.getValue().filter((x) => x.id !== id),
    );
    await this.persist();
  }

  async setTaskCategory(
    taskId: string,
    categoryId: string | null,
  ): Promise<void> {
    const next = this.tasksSubject.getValue().map((x) =>
      x.id === taskId ? { ...x, categoryId } : x,
    );
    this.tasksSubject.next(next);
    await this.persist();
  }

  /** Quita la categoría de todas las tareas que la usaban (p. ej. al borrar la categoría). */
  async clearCategoryId(categoryId: string): Promise<void> {
    const next = this.tasksSubject.getValue().map((x) =>
      x.categoryId === categoryId ? { ...x, categoryId: null } : x,
    );
    this.tasksSubject.next(next);
    await this.persist();
  }

  private newId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
