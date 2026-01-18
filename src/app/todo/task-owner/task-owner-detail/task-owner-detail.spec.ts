import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskOwnerDetail } from './task-owner-detail';

describe('TaskOwnerDetail', () => {
  let component: TaskOwnerDetail;
  let fixture: ComponentFixture<TaskOwnerDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskOwnerDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskOwnerDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
