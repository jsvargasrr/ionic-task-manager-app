import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../models/category.model';
import { Task } from '../models/task.model';
import { CategoryStorageService } from '../services/category-storage.service';
import { FirebaseRemoteFeatureService } from '../services/firebase-remote-feature.service';
import { TaskStorageService } from '../services/task-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  /** Debe coincidir con la altura efectiva de `.task-row` (CDK virtual scroll). */
  readonly taskRowPx = 92;

  readonly categories$: Observable<Category[]>;
  readonly filteredTasks$: Observable<Task[]>;
  readonly filterId$: Observable<string>;
  /** Progreso global (todas las tareas) cuando el feature flag de Remote Config está activo. */
  readonly taskProgress$: Observable<{ completed: number; total: number } | null>;
  readonly remoteAvailable$: Observable<boolean>;

  newTitle = '';
  newCategoryName = '';
  isCatModalOpen = false;

  private readonly filterCategoryId$ = new BehaviorSubject<string>('all');

  constructor(
    private readonly taskStorage: TaskStorageService,
    private readonly categoryStorage: CategoryStorageService,
    private readonly alertController: AlertController,
    private readonly remoteFeatures: FirebaseRemoteFeatureService,
  ) {
    this.categories$ = this.categoryStorage.categories$;
    this.filterId$ = this.filterCategoryId$.asObservable();
    this.remoteAvailable$ = this.remoteFeatures.remoteAvailable$;
    this.filteredTasks$ = combineLatest([
      this.taskStorage.tasks$,
      this.filterCategoryId$,
    ]).pipe(
      map(([tasks, cat]) =>
        cat === 'all' ? tasks : tasks.filter((t) => t.categoryId === cat),
      ),
    );
    this.taskProgress$ = combineLatest([
      this.taskStorage.tasks$,
      this.remoteFeatures.showTaskProgress$,
    ]).pipe(
      map(([tasks, show]) => {
        if (!show) {
          return null;
        }
        const completed = tasks.filter((t) => t.completed).length;
        return { completed, total: tasks.length };
      }),
    );
  }

  trackById(_index: number, task: Task): string {
    return task.id;
  }

  trackByCatId(_index: number, c: Category): string {
    return c.id;
  }

  setFilter(value: string | number | null | undefined): void {
    if (value == null || value === '') {
      this.filterCategoryId$.next('all');
      return;
    }
    this.filterCategoryId$.next(String(value));
  }

  async addTask(): Promise<void> {
    await this.taskStorage.addTask(this.newTitle);
    this.newTitle = '';
  }

  async onCompletedChange(task: Task, completed: boolean): Promise<void> {
    await this.taskStorage.setCompleted(task.id, completed);
  }

  async removeTask(task: Task): Promise<void> {
    await this.taskStorage.removeTask(task.id);
  }

  async onTaskCategoryChange(task: Task, value: string | string[] | null): Promise<void> {
    const raw = Array.isArray(value) ? value[0] : value;
    const categoryId =
      raw == null || raw === '' ? null : String(raw);
    await this.taskStorage.setTaskCategory(task.id, categoryId);
  }

  categoryLabel(
    categories: Category[] | null | undefined,
    categoryId: string | null | undefined,
  ): string {
    if (categoryId == null) {
      return 'Sin categoría';
    }
    const c = categories?.find((x) => x.id === categoryId);
    return c?.name ?? 'Categoría';
  }

  async addCategory(): Promise<void> {
    await this.categoryStorage.addCategory(this.newCategoryName);
    this.newCategoryName = '';
  }

  async promptEditCategory(c: Category): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Editar categoría',
      inputs: [{ name: 'name', type: 'text', value: c.name }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            const name = String(data?.name ?? '').trim();
            if (!name) {
              return false;
            }
            void this.categoryStorage.updateCategory(c.id, name);
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  async confirmDeleteCategory(c: Category): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Eliminar categoría',
      message: `¿Eliminar «${c.name}»? Las tareas dejarán de estar en esa categoría.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.categoryStorage.removeCategory(c.id);
          },
        },
      ],
    });
    await alert.present();
  }

  async refreshRemoteFeatures(): Promise<void> {
    await this.remoteFeatures.refresh();
  }
}
