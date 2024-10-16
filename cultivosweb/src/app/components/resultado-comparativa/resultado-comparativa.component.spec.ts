import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoComparativaComponent } from './resultado-comparativa.component';

describe('ResultadoComparativaComponent', () => {
  let component: ResultadoComparativaComponent;
  let fixture: ComponentFixture<ResultadoComparativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadoComparativaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultadoComparativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
