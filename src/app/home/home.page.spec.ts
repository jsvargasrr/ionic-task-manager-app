import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

import { HomePage } from './home.page';
import { CategoryStorageService } from '../services/category-storage.service';
import { TaskStorageService } from '../services/task-storage.service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        {
          provide: TaskStorageService,
          useValue: {
            tasks$: of([]),
            addTask: jasmine.createSpy('addTask').and.resolveTo(),
            setCompleted: jasmine.createSpy('setCompleted').and.resolveTo(),
            removeTask: jasmine.createSpy('removeTask').and.resolveTo(),
            setTaskCategory: jasmine.createSpy('setTaskCategory').and.resolveTo(),
          },
        },
        {
          provide: CategoryStorageService,
          useValue: {
            categories$: of([]),
            addCategory: jasmine.createSpy('addCategory').and.resolveTo(),
            updateCategory: jasmine.createSpy('updateCategory').and.resolveTo(),
            removeCategory: jasmine.createSpy('removeCategory').and.resolveTo(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
