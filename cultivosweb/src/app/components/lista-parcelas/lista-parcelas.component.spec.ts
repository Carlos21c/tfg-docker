import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaParcelasComponent } from './lista-parcelas.component';

describe('ListaParcelasComponent', () => {
  let component: ListaParcelasComponent;
  let fixture: ComponentFixture<ListaParcelasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaParcelasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaParcelasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
