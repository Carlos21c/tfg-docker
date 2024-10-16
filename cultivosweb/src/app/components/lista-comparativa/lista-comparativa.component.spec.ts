import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaComparativaComponent } from './lista-comparativa.component';

describe('ListaComparativaComponent', () => {
  let component: ListaComparativaComponent;
  let fixture: ComponentFixture<ListaComparativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaComparativaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaComparativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
