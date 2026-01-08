import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
// import { environment } from '../../environments/environment';
import { environment } from '../../environment/environment'

interface ProjectData {
  Owner: string;
  Name: string;
  Values: string;
}



@Injectable({ providedIn: 'root' })
export class ProjectService {
  // private http = inject(HttpClient);
  // https://todoapi-947367955954.europe-west1.run.app/projectlist
  private apiUrl = 'https://todoapi-947367955954.europe-west1.run.app';
  private apiUrlLocal = 'http://localhost:5173';
  //private apiUrlBase = this.apiUrl ; // environment.apiUrl;
  private apiUrlBase = this.apiUrlLocal;//  environment.apiUrl;
  //private apiUrlBase =   environment.apiUrl;
  private bucketName = 'cary-tasks';

  constructor(private http: HttpClient) { }

  // This method fetches the raw data that TanStack Query will cache
  async postTodosSummary(projectListOwner: string, projectListName: string) {
    const apiUrl = `${this.apiUrlBase}/projectlist/all-todos-from-list?Owner=${projectListOwner}&projectListName=${projectListName}`;
    // const apiUrlComplete = `${apiUrl}?bucketName=${this.bucketName}&ProjectId=todos.${projectId}.json`

    console.log('|project.service.ts|apiUrlComplete|getTodosSummary|', apiUrl)
    var projectListObject: ProjectData = { Owner: '', Name: '', Values: '' };
    projectListObject.Owner = projectListOwner;
    projectListObject.Name = projectListName;


    // const todos = await lastValueFrom(
    //     this.http.post<any[]>(apiUrl)
    // );

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };

    const todos = await lastValueFrom(
      this.http.post<any[]>(apiUrl , projectListObject, httpOptions)
    );
    // return this.http.put(apiUrlComplete, todoRecord);
    //return this.http.post(apiUrlComplete, todoRecord);
    // return lastValueFrom(this.http.post<ProjectData>(apiUrl, projectListObject, httpOptions));
    return todos;

  }
  // This method fetches the raw data that TanStack Query will cache
  async getTodos(projectId: string) {
    const apiUrl = `${this.apiUrlBase}/gcs/file-contents`;
    const apiUrlComplete = `${apiUrl}?bucketName=${this.bucketName}&ProjectId=todos.${projectId}.json`
     console.log('|project.service.ts|apiUrlComplete|getTodos|', apiUrlComplete)

        const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };


    const todos = await lastValueFrom(
      this.http.get<any[]>(apiUrlComplete , httpOptions)
    );

    return todos;
  }

  // This method fetches the raw data that TanStack Query will cache
  async saveTodos(todoRecord: any) {
    const apiUrl = `${this.apiUrlBase}/gcs/file-contents`;
    const apiUrlComplete = `${apiUrl}?bucketName=${this.bucketName}&ProjectId=todos.${todoRecord.ProjectId}.json`
    console.log('|project.service.ts|apiUrlComplete|', apiUrlComplete, todoRecord)


    // 2. Define the headers explicitly
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };
    // return this.http.put(apiUrlComplete, todoRecord);
    //return this.http.post(apiUrlComplete, todoRecord);
    return this.http.post(apiUrlComplete, todoRecord, httpOptions);
  }


  // This method fetches the raw data that TanStack Query will cache
  async getProjectList(projectListName: string) {
    const apiUrlComplete = `${this.apiUrlBase}/projectlist`
    // console.log('|project.servic.ts|apiUrlComplete|', apiUrlComplete)

    const todos = await lastValueFrom(
      this.http.get<any[]>(apiUrlComplete)
    );
    console.log('|project.servic.ts|apiUrlComplete|', apiUrlComplete)

    return todos;
  }
  // This method fetches the raw data that TanStack Query will cache
  async saveProjectList(projectListObject: any) {
    const apiUrlComplete = `${this.apiUrlBase}/projectlist?projectlistName=${projectListObject.Owner}`
    console.log('|project.servic.ts|saveProjectList|', apiUrlComplete, projectListObject)

    // 2. Define the headers explicitly
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };
    // return this.http.put(apiUrlComplete, todoRecord);
    //return this.http.post(apiUrlComplete, todoRecord);
    return lastValueFrom(this.http.post<ProjectData>(apiUrlComplete, projectListObject, httpOptions));

    // return lastValueFrom(this.http.put<ProjectData>(  apiUrlComplete , projectListObject ));
    //return lastValueFrom(this.http.post<ProjectData>(  apiUrlComplete , projectListObject ));
  }
}
