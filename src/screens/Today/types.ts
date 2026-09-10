export type TaskStatus = 'To-do' | 'In Progress' | 'Done';
export type FilterType = 'All' | 'To-do' | 'In Progress' | 'Done';

export interface Task {
  id: number;
  project: string;
  title: string;
  time: string;
  status: TaskStatus;
  date: string;
  description?: string;
  group?: string;
  endDate?: string;
}