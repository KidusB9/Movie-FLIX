import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieItem } from './movie.Item';

describe('MovieItem', () => {
  let component: MovieItem;
  let fixture: ComponentFixture<MovieItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieItem ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
