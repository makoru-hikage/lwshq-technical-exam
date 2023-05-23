export const TodoPriorities = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3
} as const;

export type TodoPriority = keyof typeof TodoPriorities;