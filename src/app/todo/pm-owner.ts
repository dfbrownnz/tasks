import { Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { TodoDetailTableComponent } from './detail'

import { FormsModule } from '@angular/forms'; // Import FormsModule
import { injectQuery } from '@tanstack/angular-query-experimental';


import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../core/project.service'
import { JsonPipe } from '@angular/common';

import { TodoSummary } from '../core/types';
import { ColumnDef, createAngularTable, getCoreRowModel, getFilteredRowModel } from '@tanstack/angular-table';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-todo-summary-table',
  standalone: true,
  imports: [TodoDetailTableComponent, FormsModule , JsonPipe ],
  templateUrl: './pm-owner.html',
  styleUrls: ['./pm-owner.css']
})
export class TodoSummaryTableComponent {

 
  private route = inject(ActivatedRoute);

  selectedProjectId = signal('0');
  selectedGroup = signal('approval');

  constructor(private router: Router) { }
  private projectService = inject(ProjectService);
  dataSource = new MatTableDataSource<any>([]);

  onIdChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.selectedProjectId.set(inputElement.value);
  }


  readonly projectOwner = toSignal(
    this.route.queryParamMap.pipe(map(params => params.get('projectOwner'))),
    { initialValue: this.route.snapshot.queryParamMap.get('projectOwner') }
  );
  readonly projectListName = toSignal(
    this.route.queryParamMap.pipe(map(params => params.get('projectList'))),
    { initialValue: this.route.snapshot.queryParamMap.get('projectList') }
  );
  readonly projectId = toSignal(
    this.route.queryParamMap.pipe(map(params => params.get('projectId'))),
    { initialValue: this.route.snapshot.queryParamMap.get('projectId') }
  );

  // readonly tableData = computed(() => {
  //   const result = this.todoSummaryData.data();
  //   // Use the array directly as seen in your JSON dump
  //   return Array.isArray(result) ? result : [];
  // });

  readonly todoSummaryData = injectQuery(() => ({
    queryKey: ['todo-summary'], // Ensure this signal has a value
    queryFn: () => this.projectService.postTodosSummary(this.projectOwner() ?? '',
      this.projectListName() ?? ''),
    enabled: !!this.projectOwner() && !!this.projectListName(), // Only run if 'bob' is found
  }));


  @Output() projectPicked = new EventEmitter<TodoSummary>();

  onRowClick(row: TodoSummary): void {
    console.log('Row clicked:TaskSummaryComponent|projectPicked|', row);
    // Emit the projectId to the parent
    this.projectPicked.emit(row);
    this.selectedProjectId.set(row.projectId);

    this.router.navigate([], {
      queryParams: {

        'projectId': row.projectId
      },
      queryParamsHandling: 'merge' // Keeps existing parameters like projectId
    });

  }

    onColumnClick(row: TodoSummary , FieldName : string ) {
    // throw new Error('Method not implemented.');
    // console.log('Row clicked:onConfigurationClick|projectPicked|', row , FieldName );

     this.projectPicked.emit(row);
    this.selectedProjectId.set(row.projectId);
    this.selectedGroup.set( FieldName );

    this.router.navigate([], {
      queryParams: {

        'projectId': row.projectId,
        'group': FieldName
      },
      queryParamsHandling: 'merge' // Keeps existing parameters like projectId
    });
  }

  me = { "projectId": "3", "statusDate": "20250103", "approval": "In Progress", "configuration": "Not Started", "testing": "Not Started", "production": "Not Started", "validation": "Not Started" };


  readonly columns: ColumnDef<any>[] = [
    { accessorKey: 'projectId', header: 'projectId' },
    { accessorKey: 'statusDate', header: 'statusDate' },
    { accessorKey: 'approval', header: 'approval' },
    { accessorKey: 'configuration', header: 'configuration' },
    { accessorKey: 'testing', header: 'testing' },
    //  { accessorKey: 'production', header: 'production' },
    //  { accessorKey: 'validation', header: 'validation' },
  ];
  //   readonly table = createAngularTable(() => ({
  //   data: this.tableData(),
  //   columns: this.columns,
  //   getCoreRowModel: getCoreRowModel(),
  // }));

  displayedColumns: string[] = [
    'projectId',
    'statusDate',
    'approval',
    'configuration',
    'testing'
  ];

  readonly query = injectQuery(() => ({
    queryKey: ['ProjectList', 'Dave'],
    queryFn: () => this.projectService.getProjectList('1'),
  }));

  readonly tableData = computed(() => this.todoSummaryData.data() ?? []);
  readonly globalFilter = signal('');

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



}