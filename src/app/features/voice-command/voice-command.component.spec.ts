import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceCommandComponent } from './voice-command.component';

describe('VoiceCommandComponent', () => {
  let component: VoiceCommandComponent;
  let fixture: ComponentFixture<VoiceCommandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoiceCommandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VoiceCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
