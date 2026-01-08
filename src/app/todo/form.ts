import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { ProjectService } from './../core/project.service'
import { QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatFormFieldModule, CommonModule, MatCardModule , FormsModule],
  templateUrl: './form.html',
  styleUrls: ['./form.css']
  
})
export class TaskFormComponent {
  private fb = inject(FormBuilder);

  private projectService = inject(ProjectService);

   // Initialize the form with fields matching your data keys
  projectForm = this.fb.group({
    ProjectId: [''],
    Id: [''],
    Description: [''],
    Name: [''],
    Group: [''],
    Owner: [''],
    StatusFlag: [''],
    StatusDate: ['']
  });

  @Input() selectedRowFormData: any;

  
 

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedRowFormData'] && changes['selectedRowFormData'].currentValue) {
      console.log('ngOnChanges triggered');
      this.projectForm.patchValue(changes['selectedRowFormData'].currentValue);
    }
  }
  // 1. You must add the @Input decorator here to clear the error @Input() selectedRowData: any;
  @Input() set selectedRowForm(data: any) {
    console.log('Populating form with:', data);
    if (data) {
      console.log('Form receiving data:', data);
      this.projectForm.patchValue(data); // Auto-fills the form
         }
  }


  // inside MyProjectsFormComponent
  logFormValues() {
    // .value captures all fields: Task Id, Group, Name, Description, Status, and Date
    const formData = this.projectForm.value;

    console.log('Current Form Values:', formData);

    // You can also access specific fields shown on your screen
    console.log('Editing Task:', formData.Name);
  }
  private queryClient = inject(QueryClient);
  private snackBar = inject(MatSnackBar);

  async onSave() {

    const ex = { ...this.projectForm.getRawValue(), ProjectId: this.selectedRowFormData.ProjectId };
    
    (await

      this.projectService.saveTodos(ex)).subscribe({
        next: () => {
          console.log('Save successful');

          // 1. Clear the form values
          this.projectForm.reset();

          // 2. Refresh the table data
          this.queryClient.invalidateQueries({ queryKey: ['projects'] });

          // 3. Optional: Clear the selection state in the parent
          this.selectedRowFormData = null;

          // Trigger Success Toast
          this.snackBar.open('Saved successfully!', 'OK', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
          });

        },
        // error: (err) => console.error('Save failed', err)
        error: (err: any) => {

          // Trigger Error Toast
          this.snackBar.open('Save failed!', 'OK', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
          });
        }
      });

  }
}