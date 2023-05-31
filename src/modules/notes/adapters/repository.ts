import { Knex } from 'knex';
import { format } from 'date-fns-tz';
import { Note, NoteInsertData, NoteUpdateData } from '../domain/note';

const TZ = process.env.TZ || 'Asia/Manila';

class NoteRepository {
  private knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  public async create(note: NoteInsertData): Promise<Note> {
    const [id] = await this.knex('notes')
      .insert(note)
      .returning(['id', 'title', 'user_id', 'text', 'created_at']);
    return id;
  }

  public async getById(id: string, userId: string): Promise<Note | null> {
    const note = await this.knex('notes')
      .select('*')
      .where('id', id)
      .where('user_id', userId)
      .first();
    return note || null;
  }

  public async getAll(userId: string): Promise<Note[]> {
    const notes = await this.knex('notes')
      .select('*')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc');
    return notes;
  }

  public async update(
    id: string,
    updates: Partial<NoteUpdateData>,
    userId: string,
  ): Promise<boolean> {
    const result = await this.knex('notes')
      .where('id', id)
      .where('user_id', userId)
      .update({
        updated_at: format(new Date(), `yyyy-MM-dd'T'HH:mm:ss.SSSX`, {
          timeZone: TZ,
        }),
        ...updates,
      });
    return result > 0;
  }

  public async delete(id: string, userId: string): Promise<boolean> {
    const result = await this.knex('notes')
      .where('id', id)
      .where('user_id', userId)
      .del();
    return result > 0;
  }
}

export default NoteRepository;
