import { createContext, ReactNode, useContext, useState } from 'react';

export type TaskStatus = 'To-do' | 'In Progress' | 'Done';

export interface Task {
  id: number;
  project: string;
  title: string;
  status: TaskStatus;
  date: string;
  description?: string;
  group?: string;
  endDate?: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'status'>) => void;
  updateTask: (id: number, task: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  getTaskStatus: (date: string) => TaskStatus;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const getTaskStatus = (date: string): TaskStatus => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);
    
    if (taskDate < today) {
      return 'Done';
    } else if (taskDate.getTime() === today.getTime()) {
      return 'In Progress';
    } else {
      return 'To-do';
    }
  };

  const addTask = (task: Omit<Task, 'status'>) => {
    const status = getTaskStatus(task.date);
    const newTask: Task = { ...task, status };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: number, updatedTask: Partial<Task>) => {
    setTasks((prev) => {
      const newTasks = prev.map((task) => {
        if (task.id === id) {
          const newTask = { ...task, ...updatedTask };
          if (updatedTask.date) {
            newTask.status = getTaskStatus(updatedTask.date);
          }
          return newTask;
        }
        return task;
      });
      return newTasks;
    });
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, getTaskStatus }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};