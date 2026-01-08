import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental'; // mutate state 
// import { ProjectService } from '../core/project.service';
import { ProjectService } from '../core/project.service'

import { Component, computed, inject, input, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; //
import { CommonModule, JsonPipe } from '@angular/common';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';



import {
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
  getFilteredRowModel
} from '@tanstack/angular-table';
import { lastValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

// Define the shape of your data
interface ProjectData {
  Owner: string;
  Name: string;
  Values: string;
}

@Component({
  selector: 'app-project-list',
  imports: [FlexRenderDirective, CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
  ],
  standalone: true,
  templateUrl: './project.html',
  styleUrl: './project.css',
})
export class ProjectList {

  projectListName: string = 'Dave';
  private projectService = inject(ProjectService);
  private fb = inject(FormBuilder);

  private snackBar = inject(MatSnackBar);

  // Initialize form with validation
  projectForm = this.fb.group({
    Owner: ['', Validators.required],
    Name: ['', Validators.required],
    Values: ['', Validators.required]
  });
  private queryClient = inject(QueryClient);
  constructor(private router: Router) { }

  onSubmit() {
    if (this.projectForm.valid) {
      console.log('Form Data:', this.projectForm.value);

      // Here you would typically call your injectMutation to save the data
      this.mutation.mutate(this.projectForm.value);

    }
  }

  //  queryFn: () => this.projectService.getProjectList( '1' ),

  mutation = injectMutation(() => ({
    mutationFn: (newData: any) =>
      this.projectService.saveProjectList(newData),
    onSuccess: () => {
      // Invalidate and refetch to update the UI on your screen
      this.queryClient.invalidateQueries({ queryKey: ['ProjectList', 'Dave'] });

      // Trigger Success Toast
      this.snackBar.open('Project list saved successfully!', 'OK', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });

      setTimeout(() => {

        this.projectForm.reset();
      });

    },
    onError: (error: any) => {

      // Trigger Error Toast
      this.snackBar.open('Project list save failed!', 'OK', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
    }
  }));

  // Define table columns
  readonly columns = [
    { accessorKey: 'Owner', header: 'Owner' },
    { accessorKey: 'Name', header: 'Name' },
    { accessorKey: 'Values', header: 'Values' }
  ];

  readonly query = injectQuery(() => ({
    queryKey: ['ProjectList', 'Dave'],
    queryFn: () => this.projectService.getProjectList('1'),
  }));

  readonly tableData = computed(() => this.query.data() ?? []);
  readonly globalFilter = signal('');

  table = createAngularTable(() => ({
    // data: this.data(),
    data: this.tableData(),
    columns: this.columns,
    state: {
      globalFilter: this.globalFilter(),
    },
    onGlobalFilterChange: (value) => this.globalFilter.set(value),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Required for filtering
  }));

  onRowClick(rowData: any) {
    console.log('Row clicked: assign these to the url params', rowData);

    this.projectForm.patchValue({
      Owner: rowData.Owner,
      Name: rowData.Name,
      Values: rowData.Values
    });

    this.router.navigate([], {
      queryParams: {
        'projectOwner': rowData.Owner,
        'projectList': rowData.Name
      },
      queryParamsHandling: 'merge' // Keeps existing parameters like projectId
    });

  }


  clearFilter() { this.globalFilter.set(''); }

}
