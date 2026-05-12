import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';
import { TaskStorageService } from './task-storage.service';

describe('TaskStorageService', () => {
  let service: TaskStorageService;
  let storageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('Storage', ['create', 'get', 'set']);
    storageSpy.create.and.resolveTo(storageSpy);
    storageSpy.get.and.resolveTo([]);

    TestBed.configureTestingModule({
      providers: [
        TaskStorageService,
        { provide: Storage, useValue: storageSpy },
      ],
    });
    service = TestBed.inject(TaskStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
