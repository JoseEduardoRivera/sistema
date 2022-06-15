import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariodetalleComponent } from './usuariodetalle.component';

describe('UsuariodetalleComponent', () => {
  let component: UsuariodetalleComponent;
  let fixture: ComponentFixture<UsuariodetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariodetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariodetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
