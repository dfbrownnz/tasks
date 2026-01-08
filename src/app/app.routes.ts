import { Routes } from '@angular/router';
import { TodoSummaryTableComponent } from './todo/summary'
import {ProjectList } from './project/projects'

 
export const routes: Routes = [
  { path: 'task', component: TodoSummaryTableComponent },
  { path: 'project' , component: ProjectList } , 
//   { path: 'user/:id', component: UserDetailComponentUrl },
  { path: '', redirectTo: '/', pathMatch: 'full' }
];
