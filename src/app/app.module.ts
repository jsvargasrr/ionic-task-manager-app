import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CategoryStorageService } from './services/category-storage.service';
import { FirebaseRemoteFeatureService } from './services/firebase-remote-feature.service';
import { TaskStorageService } from './services/task-storage.service';

export function taskStorageInitializer(svc: TaskStorageService): () => Promise<void> {
  return () => svc.init();
}

export function categoryStorageInitializer(
  svc: CategoryStorageService,
): () => Promise<void> {
  return () => svc.init();
}

export function firebaseRemoteFeatureInitializer(
  svc: FirebaseRemoteFeatureService,
): () => Promise<void> {
  return () => svc.init();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot({ name: '__task_manager_db' }),
    AppRoutingModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [TaskStorageService],
      useFactory: taskStorageInitializer,
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [CategoryStorageService],
      useFactory: categoryStorageInitializer,
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [FirebaseRemoteFeatureService],
      useFactory: firebaseRemoteFeatureInitializer,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
