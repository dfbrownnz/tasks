import { Component, input, inject, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { ProjectService } from '../core/project.service'
import { TaskFormComponent } from './form'
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-todo-detail-table',
  standalone: true,
  imports: [ TaskFormComponent , JsonPipe ],
  templateUrl: `detail.html`,
  styleUrls: ['detail.css']
})
export class TodoDetailTableComponent {
 
  private http = inject(HttpClient);
  private projectService = inject(ProjectService);

  selectedProjectId = input.required<string>();

  private querykey = computed(() => ['todo-detail', this.selectedProjectId()]);

  userQuery = injectQuery(() => ({
    queryKey: ['todo-detail', this.selectedProjectId()], // Ensure this signal has a value
    queryFn: () => (this.projectService.getTodos(this.selectedProjectId() ?? '')),
    enabled: !!this.selectedProjectId(), // Only run if 'bob' is found
  }));

  clickedRow: any;
  //selectedRowData = signal<any>({});
  onRowClick(row: any) {
    console.log('Task Detail one Task | Row clicked:', row);
    //this.selectedRowData = row;
    this.clickedRow = row;
    //this.selectedRowData.set(row);
  }
}