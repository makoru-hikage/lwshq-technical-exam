import NoteRepository from './adapters/repository';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default function NoteController(fastify: FastifyInstance) {
  return {
    createNote: async (
      request: FastifyRequest<{Body: {
        title: string,
        text: string
      }}>,
      reply: FastifyReply
    ): Promise<FastifyInstance> => {
      try {
        const user = request.user;
        const { title, text } = request.body;
        const input = { title, text };
        const noteRepo = new NoteRepository(fastify.knex);
        const note = await noteRepo.create({
          user_id: user.id,
          ...input
        });
        return reply.status(201).send({
          message: 'Note created!',
          data: note
        });
      } catch (error) {
        console.error('Error creating note:', error);
        return reply.status(500).send({ error: 'Failed to create note' });
      }
    },
  
    getNoteById: async (
      request: FastifyRequest<{ Params: {
        id: string;
      }}>,
      reply: FastifyReply
    ): Promise<void> => {
      try {
        const { id } = request.params;
        const noteRepo = new NoteRepository(fastify.knex);
        const note = await noteRepo.getById(id);
        if (note) {
          reply.status(200).send(note);
        } else {
          reply.status(404).send({ error: 'Note not found' });
        }
      } catch (error) {
        console.error('Error retrieving note:', error);
        reply.status(500).send({ error: 'Failed to retrieve note' });
      }
    },
  
    getAllNotes: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        const noteRepo = new NoteRepository(fastify.knex);
        const notes = await noteRepo.getAll();
        reply.status(200).send({
          message: "Notes fetched!",
          data: notes
        });
      } catch (error) {
        console.error('Error retrieving notes:', error);
        reply.status(500).send({ error: 'Failed to retrieve notes' });
      }
    },
  
    updateNote: async (
      request: FastifyRequest<{
        Body: {
          title: string,
          text: string
        },
        Params: { id: string }
      }>,
      reply: FastifyReply
    ): Promise<void> => {
      try {
        const { id } = request.params;
        const { title, text } = request.body;
        const updates = { title, text };
        const noteRepo = new NoteRepository(fastify.knex);
        const success = await noteRepo.update(id, updates);
        if (success) {
          reply.status(200).send({ success: true });
        } else {
          reply.status(404).send({ error: 'Note not found' });
        }
      } catch (error) {
        console.error('Error updating note:', error);
        reply.status(500).send({ error: 'Failed to update note' });
      }
    },
  
    deleteNote: async (
      request: FastifyRequest<{ Params: {
        id: string;
      }}>,
      reply: FastifyReply
    ): Promise<void> => {
      try {
        const { id } = request.params;
        const noteRepo = new NoteRepository(fastify.knex);
        const success = await noteRepo.delete(id);
        if (success) {
          reply.status(200).send({ success: true });
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

