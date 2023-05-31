import NoteRepository from './adapters/repository';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { NoteInsertData, NoteUpdateData } from './domain/note';

export default function NoteController(fastify: FastifyInstance) {
  return {
    createNote: async (
      request: FastifyRequest<{ Body: Omit<NoteInsertData, 'user_id'> }>,
      reply: FastifyReply,
    ): Promise<FastifyInstance> => {
      try {
        const user = request.user;
        const input = request.body;
        const noteRepo = new NoteRepository(fastify.knex);
        const note = await noteRepo.create({
          user_id: user.id,
          ...input,
        });
        return reply.status(201).send({
          message: 'Note created!',
          data: note,
        });
      } catch (error) {
        console.error('Error creating note:', error);
        return reply.status(500).send({ error: 'Failed to create note' });
      }
    },

    getNoteById: async (
      request: FastifyRequest<{
        Params: {
          id: string;
        };
      }>,
      reply: FastifyReply,
    ): Promise<void> => {
      try {
        const { id } = request.params;
        const user = request.user;
        const noteRepo = new NoteRepository(fastify.knex);
        const note = await noteRepo.getById(id, user.id);
        if (note) {
          reply.status(200).send({
            message: 'Note found!',
            data: note,
          });
        } else {
          reply.status(404).send({ error: 'Note not found' });
        }
      } catch (error) {
        console.error('Error retrieving note:', error);
        reply.status(500).send({ error: 'Failed to retrieve note' });
      }
    },

    getAllNotes: async (
      request: FastifyRequest,
      reply: FastifyReply,
    ): Promise<void> => {
      try {
        const user = request.user;
        const noteRepo = new NoteRepository(fastify.knex);
        const notes = await noteRepo.getAll(user.id);
        reply.status(200).send({
          message: 'Notes fetched!',
          data: notes,
        });
      } catch (error) {
        console.error('Error retrieving notes:', error);
        reply.status(500).send({ error: 'Failed to retrieve notes' });
      }
    },

    updateNote: async (
      request: FastifyRequest<{
        Body: NoteUpdateData;
        Params: { id: string };
      }>,
      reply: FastifyReply,
    ): Promise<void> => {
      try {
        const user = request.user;
        const { id } = request.params;
        const updates = request.body;
        const noteRepo = new NoteRepository(fastify.knex);
        const success = await noteRepo.update(id, updates, user.id);
        if (success) {
          reply.status(200).send({ message: 'Note Updated!', data: updates });
        } else {
          reply.status(404).send({ error: 'Note not found' });
        }
      } catch (error) {
        console.error('Error updating note:', error);
        reply.status(500).send({ error: 'Failed to update note' });
      }
    },

    deleteNote: async (
      request: FastifyRequest<{
        Params: {
          id: string;
        };
      }>,
      reply: FastifyReply,
    ): Promise<void> => {
      try {
        const user = request.user;
        const { id } = request.params;
        const noteRepo = new NoteRepository(fastify.knex);
        const success = await noteRepo.delete(id, user.id);
        if (success) {
          reply.status(204).send();
        } else {
          reply.status(404).send({ error: 'Note not found' });
        }
      } catch (error) {
        console.error('Error deleting note:', error);
        reply.status(500).send({ error: 'Failed to delete note' });
      }
    },
  };
}
