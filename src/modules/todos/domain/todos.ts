import { TodoPriority } from "./priorities";

export type Todo = {
  title: string;
  description: string;
  completed: boolean;
  priority: TodoPriority
};
