import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { TaskStorageService } from './task-storage.service';

const STORAGE_KEY = 'tm_categories';
const PERSIST_DEBOUNCE_MS = 350;

@Injectable({ providedIn: 'root' })
export class CategoryStorageService {
  private readonly categoriesSubject = new BehaviorSubject<Category[]>([]);

  readonly categories$: Observable<Category[]> =
    this.categoriesSubject.asObservable();

  private persistTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly storage: Storage,
    private readonly taskStorage: TaskStorageService,
  ) {}

  async init(): Promise<void> {
    await this.storage.create();
    const stored = await this.storage.get(STORAGE_KEY);
    const list: Category[] = Array.isArray(stored) ? stored : [];
    this.categoriesSubject.next(list);
  }

  private async persist(): Promise<void> {
    await this.storage.set(STORAGE_KEY, this.categoriesSubject.getValue());
  }

  private schedulePersistDebounced(): void {
    if (this.persistTimer != null) {
      clearTimeout(this.persistTimer);
    }
    this.persistTimer = setTimeout(() => {
      this.persistTimer = null;
      void this.persist();
    }, PERSIST_DEBOUNCE_MS);
  }

  private async persistImmediate(): Promise<void> {
    if (this.persistTimer != null) {
      clearTimeout(this.persistTimer);
      this.persistTimer = null;
    }
    await this.persist();
  }

  async addCategory(name: string): Promise<void> {
    const n = name.trim();
    if (!n) {
      return;
    }
    const cat: Category = { id: this.newId(), name: n };
    this.categoriesSubject.next([
      ...this.categoriesSubject.getValue(),
      cat,
    ]);
    await this.persistImmediate();
  }

  async updateCategory(id: string, name: string): Promise<void> {
    const n = name.trim();
    if (!n) {
      return;
    }
    const next = this.categoriesSubject
      .getValue()
      .map((c) => (c.id === id ? { ...c, name: n } : c));
    this.categoriesSubject.next(next);
    this.schedulePersistDebounced();
  }

  async removeCategory(id: string): Promise<void> {
    this.categoriesSubject.next(
      this.categoriesSubject.getValue().filter((c) => c.id !== id),
    );
    await this.persistImmediate();
    await this.taskStorage.clearCategoryId(id);
  }

  private newId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `cat-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
