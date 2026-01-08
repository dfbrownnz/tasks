import { Component, input, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { ProjectService } from '../core/project.service'

@Component({
  selector: 'app-todo-detail-table',
  standalone: true,
  templateUrl: `detail.html`
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
  onRowClick(row: any) {
    console.log('Task Detail one Task | Row clicked:', row);
    this.clickedRow = row;
  }
}