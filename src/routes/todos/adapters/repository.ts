import { Knex } from 'knex';

export class TodoRepository {

  knex: Knex;

  constructor(knex: Knex){
    this.knex = knex;
  }

  // Create a new record
  async createRecord(data: any): Promise<any> {
    try {
      const knex = this.knex;
      const [recordId] = await knex('todos').insert(data);
      return recordId;
    } catch (error) {
      throw new Error('Failed to create record');
    }
  }

  // Read a single record by ID
  async getRecordById(id: number): Promise<any | null> {
    try {
      const knex = this.knex;
      const record = await knex('todos').where({ id }).first();
      return record || null;
    } catch (error) {
      throw new Error('Failed to get record by ID');
    }
  }

  // Update an existing record by ID
  async updateRecordById(id: number, data: any): Promise<boolean> {
    try {
      const knex = this.knex;
      const updatedCount = await knex('todos').where({ id }).update(data);
      return updatedCount > 0;
    } catch (error) {
      throw new Error('Failed to update record by ID');
    }
  }

  // Delete a record by ID
  async deleteRecordById(id: number): Promise<boolean> {
    try {
      const knex = this.knex;
      const deletedCount = await knex('todos').where({ id }).del();
      return deletedCount > 0;
    } catch (error) {
      throw new Error('Failed to delete record by ID');
    }
  }

}
