import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutguardComponent } from './logoutguard.component';

describe('LogoutguardComponent', () => {
  let component: LogoutguardComponent;
  let fixture: ComponentFixture<LogoutguardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoutguardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogoutguardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
