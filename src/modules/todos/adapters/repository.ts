import { Knex } from 'knex';
import { Todo, TodoInsertData, TodoUpdateData } from '../domain/todos';
import { format } from 'date-fns-tz';

const TZ = process.env.TZ || 'Asia/Manila';

export default class TodoRepository {
  knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  // Create a new todo
  async create(input: TodoInsertData): Promise<Todo> {
    try {
      const knex = this.knex;
      const [todo] = await knex('todos')
        .insert(input)
        .returning(['id', 'title', 'description', 'priority', 'completed']);
      return todo;
    } catch (error) {
      throw new Error('Failed to create todo');
    }
  }

  // Read all todos by ID
  async getAll(user_id: string): Promise<Todo[]> {
    try {
      const knex = this.knex;
      const todos = await knex('todos')
        .where({ user_id })
        .orderBy('created_at', "desc");
      return todos || [];
    } catch (error) {
      throw new Error('Failed to get all todos');
    }
  }

  // Read a single todo by ID
  async getById(id: string): Promise<Todo | null> {
    try {
      const knex = this.knex;
      const todo = await knex('todos').where({ id }).first();
      return todo || null;
    } catch (error) {
      throw new Error('Failed to get todo by ID');
    }
  }

  // Update an existing todo by ID
  async update(id: string, updates: TodoUpdateData): Promise<boolean> {
    try {
      const knex = this.knex;
      const updatedCount = await knex('todos')
        .where({ id })
        .update({
          updated_at: format(new Date(), `yyyy-MM-dd'T'HH:mm:ss.SSSX`, {
            timeZone: TZ,
          }),
          ...updates,
        });
      return updatedCount > 0;
    } catch (error) {
      throw new Error('Failed to update todo by ID');
    }
  }

  // Delete a todo by ID
  async delete(id: string): Promise<boolean> {
    try {
      const knex = this.knex;
      const deletedCount = await knex('todos').where({ id }).del();
      return deletedCount > 0;
    } catch (error) {
      throw new Error('Failed to delete todo by ID');
    }
  }
}
