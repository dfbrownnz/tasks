import { Component, input, inject, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { ProjectService } from '../../../core/project.service'
import { TaskFormComponent } from '../../form'
import { JsonPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';


@Component({
  selector: 'app-task-owner-detail',
  imports: [TaskFormComponent , JsonPipe ],
  templateUrl: './task-owner-detail.html',
  styleUrl: './task-owner-detail.css',
})
export class TaskOwnerDetail {


  private http = inject(HttpClient); // Object is of type 'unknown'.
  private projectService = inject(ProjectService);

  
  readonly route = inject(ActivatedRoute);  
 

  
  readonly projectOwner = toSignal(
    this.route.queryParamMap.pipe(map(params => params.get('projectOwner'))),
    { initialValue: this.route.snapshot.queryParamMap.get('projectOwner') }
  );
  readonly projectListName = toSignal(
    this.route.queryParamMap.pipe(map(params => params.get('projectList'))),
    { initialValue: this.route.snapshot.queryParamMap.get('projectList') }
  );

  readonly taskOwnerFromRoute = toSignal(
        this.route.queryParamMap.pipe( map(params => params.get('taskOwner')) ),
    { initialValue: this.route.snapshot.queryParamMap.get('taskOwner') }
  );
  
  userQuery = injectQuery(() => ({
    
    
    queryKey: ['todo-detail-owner',   this.projectOwner() , this.projectListName() , this.taskOwnerFromRoute() ], // Ensure this signal has a value
    queryFn: () => this.projectService.getTodosByProjectListAndProjectOwner( this.projectOwner() ?? '' ,  this.projectListName() ?? '' ,  this.taskOwnerFromRoute() ?? ''),
    enabled: !!this.projectOwner() && !!this.projectListName() && !! this.taskOwnerFromRoute() , // Only run if 'bob' is found
  }));

  // readonly tableData = computed(() => this.todoSummaryData.data() ?? []);
  // readonly todoSummaryData = injectQuery(() => ({
  //   queryKey: ['todo-owner'], // Ensure this signal has a value
  //   queryFn: () => this.projectService.getTodosByProjectListAndProjectOwner(this.projectOwner() ?? '',
  //     this.projectListName() ?? ''),
  //   enabled: !!this.projectOwner() && !!this.projectListName(), // Only run if 'bob' is found
  // }));

  clickedRow: any;
  //selectedRowData = signal<any>({});
  onRowClick(row: any) {
    console.log('Task Detail one Task | Row clicked:', row);
    //this.selectedRowData = row;
    this.clickedRow = row;
    //this.selectedRowData.set(row);
  }


  
}
