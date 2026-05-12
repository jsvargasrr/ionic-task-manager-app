import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { TaskStorageService } from './task-storage.service';

const STORAGE_KEY = 'tm_categories';

@Injectable({ providedIn: 'root' })
export class CategoryStorageService {
  private readonly categoriesSubject = new BehaviorSubject<Category[]>([]);

  readonly categories$: Observable<Category[]> =
    this.categoriesSubject.asObservable();

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
    await this.persist();
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
    await this.persist();
  }

  async removeCategory(id: string): Promise<void> {
    this.categoriesSubject.next(
      this.categoriesSubject.getValue().filter((c) => c.id !== id),
    );
    await this.persist();
    await this.taskStorage.clearCategoryId(id);
  }

  private newId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `cat-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
