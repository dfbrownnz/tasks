import { Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatFormField, MatLabel } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Router } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { map } from 'rxjs';
import { ProjectService } from '../../core/project.service';
import { ColumnDef, createAngularTable, getCoreRowModel } from '@tanstack/angular-table';
import { TodoSummary } from '../../core/types';
import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TaskOwnerDetail } from './task-owner-detail/task-owner-detail';



@Component({
  selector: 'app-task-owner',
  imports: [MatFormField, MatLabel, MatSelectModule , JsonPipe , TaskOwnerDetail ],
  templateUrl: './task-owner.html',
  styleUrl: './task-owner.css',
})

 

export class TaskOwner {

  constructor(private router: Router) { }
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  // private projectListName = input.required<string>();


  selectedTaskOwner = signal('ted');
  @Output() projectPicked = new EventEmitter<TodoSummary>();
  // selectedProjectId = signal('1');
  // selectedGroup = signal('approval');


  onOwnerSelected($event: MatSelectChange<any>) {
    this.selectedTaskOwner.set($event.value);

    this.router.navigate([], {
      queryParams: {

        'taskOwner': $event.value
      },
      queryParamsHandling: 'merge' // Keeps existing parameters like projectId
    });

  }
  owners: string[] = ['Dave', 'ted', 'Charlie', 'David'];


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

  readonly tableData = computed(() => this.todoSummaryData.data() ?? []);

  readonly todoSummaryData = injectQuery(() => ({
    queryKey: ['todo-owner'], // Ensure this signal has a value
    queryFn: () => this.projectService.getTodosByProjectListAndProjectOwner(this.projectOwner() ?? '',
      this.projectListName() ?? '' , this.taskOwnerFromRoute() ?? '' ),
    enabled: !!this.projectOwner() && !!this.projectListName(), // Only run if 'bob' is found
  }));

  
  readonly columns: ColumnDef<any>[] = [
    { accessorKey: 'projectId', header: 'ProjectId' },
    { accessorKey: 'statusDate', header: 'statusDate' },
    { accessorKey: 'approval', header: 'approval' },
    { accessorKey: 'configuration', header: 'configuration' },
    { accessorKey: 'testing', header: 'testing' },
    //  { accessorKey: 'production', header: 'production' },
    //  { accessorKey: 'validation', header: 'validation' },
  ];
  table = createAngularTable(() => ({
    // data: this.data(),
    data: this.tableData(),
    columns: this.columns,
    // state: {
    //   globalFilter: this.globalFilter(),
    // },
    //onGlobalFilterChange: (value) => this.globalFilter.set(value),
    getCoreRowModel: getCoreRowModel(),
    //getFilteredRowModel: getFilteredRowModel(), // Required for filtering
  }));


  


  onColumnClick(row: TodoSummary, FieldName: string) {

    this.projectPicked.emit(row);
    console.log( "{row.projectId}" , row )
    // this.selectedProjectId.set(row.projectId);
    // this.selectedGroup.set(FieldName);

    this.router.navigate([], {
      queryParams: {

        'projectId': row.projectId,
        'group': FieldName
      },
      queryParamsHandling: 'merge' // Keeps existing parameters like projectId
    });
  }

  
  private http = inject(HttpClient);
  // private projectService = inject(ProjectService);
  // selectedProjectId = input.required<string>();

  private querykey = computed(() => ['todo-detail', this.projectListName()]);

  userQuery = injectQuery(() => ({
    queryKey: ['todo-detail', this.projectListName()], // Ensure this signal has a value
    queryFn: () => (this.projectService.getTodos(this.projectListName() ?? '')),
    enabled: !!this.projectListName(), // Only run if 'bob' is found
  }));

  clickedRow: any;
  //selectedRowData = signal<any>({});
  onRowClick(row: any) {
    // console.log('Task Detail one Task | Row clicked:', row);
    //this.selectedRowData = row;
    this.clickedRow = row;
    //this.selectedRowData.set(row);
  }


}
