import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CultivoDataComponent } from './cultivo-data.component';

describe('CultivoDataComponent', () => {
  let component: CultivoDataComponent;
  let fixture: ComponentFixture<CultivoDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CultivoDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CultivoDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
