import { Routes } from '@angular/router';
import { TodoSummaryTableComponent } from './todo/pm-owner'
import {ProjectList } from './project/projects'
import { TaskOwner } from './todo/task-owner/task-owner'

 
export const routes: Routes = [
  { path: 'task', component: TodoSummaryTableComponent },
  { path: 'project' , component: ProjectList } , 

  { path: 'task-owner' , component: TaskOwner } , 
  //   { path: 'user/:id', component: UserDetailComponentUrl },
  { path: '', redirectTo: '/project', pathMatch: 'full' }
];
