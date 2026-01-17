import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskOwner } from './task-owner';

describe('TaskOwner', () => {
  let component: TaskOwner;
  let fixture: ComponentFixture<TaskOwner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskOwner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskOwner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
