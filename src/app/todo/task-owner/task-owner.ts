import { Component, signal } from '@angular/core';
import { MatFormField, MatLabel } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-owner',
  imports: [MatFormField, MatLabel, MatSelectModule],
  templateUrl: './task-owner.html',
  styleUrl: './task-owner.css',
})
export class TaskOwner {

  constructor(private router: Router) { }

  selectedTaskOwner = signal('ted');

  onOwnerSelected($event: MatSelectChange<any>) {
    this.selectedTaskOwner.set($event.value);

    this.router.navigate([], {
      queryParams: {

        'taskOwner': $event.value
      },
      queryParamsHandling: 'merge' // Keeps existing parameters like projectId
    });

  }
  owners: string[] = ['Alice', 'Bob', 'Charlie', 'David'];





}
