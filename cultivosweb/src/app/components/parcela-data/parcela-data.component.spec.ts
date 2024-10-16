import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelaDataComponent } from './parcela-data.component';

describe('ParcelaDataComponent', () => {
  let component: ParcelaDataComponent;
  let fixture: ComponentFixture<ParcelaDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcelaDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParcelaDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
