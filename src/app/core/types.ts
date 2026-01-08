export interface Todo {
  ProjectId: string;
  Id: number;
  Description: string;
  Name: string;
  Group: string;
  Owner : string;
  StatusFlag: string;
  StatusDate: string;
}

export interface TodoSummary {
  projectId: string;
  statusDate: string;
  approval: string;
  configuration: string;
  testing: string;
  production: string;
  validation: string;
}