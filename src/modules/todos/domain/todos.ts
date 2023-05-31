import { TodoPriority } from "./priorities";

export type Todo = {
  user_id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TodoPriority
};

export type TodoInsertData = {
  user_id: string;
  title: string;
  description: string;
  priority: TodoPriority;
};

export type TodoUpdateData = {
  title: string;
  description: string;
  priority: TodoPriority;
  completed: boolean;
};
