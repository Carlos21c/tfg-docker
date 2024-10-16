import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CultivoFileComponent } from '../../services/cultivo-file.component';

describe('CultivoFileComponent', () => {
  let component: CultivoFileComponent;
  let fixture: ComponentFixture<CultivoFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CultivoFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CultivoFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
