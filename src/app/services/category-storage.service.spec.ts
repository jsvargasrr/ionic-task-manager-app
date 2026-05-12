import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';
import { CategoryStorageService } from './category-storage.service';
import { TaskStorageService } from './task-storage.service';

describe('CategoryStorageService', () => {
  let service: CategoryStorageService;
  let storageSpy: jasmine.SpyObj<Storage>;
  let taskSpy: jasmine.SpyObj<TaskStorageService>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('Storage', ['create', 'get', 'set']);
    storageSpy.create.and.resolveTo(storageSpy);
    storageSpy.get.and.resolveTo([]);

    taskSpy = jasmine.createSpyObj('TaskStorageService', ['clearCategoryId']);
    taskSpy.clearCategoryId.and.resolveTo();

    TestBed.configureTestingModule({
      providers: [
        CategoryStorageService,
        { provide: Storage, useValue: storageSpy },
        { provide: TaskStorageService, useValue: taskSpy },
      ],
    });
    service = TestBed.inject(CategoryStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
