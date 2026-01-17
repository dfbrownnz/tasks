import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';


import { RouterLink, RouterLinkActive } from '@angular/router'; // Add this
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; // 1. Import CommonModule
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { TodoSummaryTableComponent } from "./todo/pm-owner";
import { ProjectList } from "./project/projects";



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterOutlet, RouterLink, RouterLinkActive, CommonModule , MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Todos');

    currentProjectId: string | null = null;
  projectOwner: string | null = null;
  projectList: string | null = null;

  constructor(private route: ActivatedRoute) { }

    //isSidebarCollapsed = false; // Initial state: expanded
  isSidebarCollapsed: boolean = true; // Initial state: collapsed


  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  ngOnInit() {
    // This listens to any changes in the URL query parameters globally
    this.route.queryParams.subscribe(params => {
      this.currentProjectId = params['projectId'];
      this.projectOwner = params['projectOwner']; // http://localhost:4200/ProjectList?projectId=1&project-owner=ted&project-list=26q1
      this.projectList = params['projectList']; // http://localhost:4200/ProjectList?projectId=1&project-owner=ted&project-list=26q1
    });
  }

}
