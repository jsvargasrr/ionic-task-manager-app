import { TestBed } from '@angular/core/testing';
import { FirebaseRemoteFeatureService } from './firebase-remote-feature.service';

describe('FirebaseRemoteFeatureService', () => {
  it('should be created', () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(FirebaseRemoteFeatureService);
    expect(service).toBeTruthy();
  });

  it('init sin firebase en environment no lanza', async () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(FirebaseRemoteFeatureService);
    await expectAsync(service.init()).toBeResolved();
  });
});
