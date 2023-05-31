import TodoRepository from './adapters/repository';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { TodoInsertData, TodoUpdateData } from './domain/todos';

export default function TodoController(fastify: FastifyInstance) {
  return {
    createTodo: async (
      request: FastifyRequest<{ Body: Omit<TodoInsertData, 'user_id'> }>,
      reply: FastifyReply,
    ): Promise<FastifyInstance> => {
      try {
        const user = request.user;
        const input = request.body;
        const todoRepo = new TodoRepository(fastify.knex);
        const todo = await todoRepo.create({
          ...input,
          user_id: user.id,
        });
        return reply.status(201).send({
          message: 'Todo created!',
          data: todo,
        });
      } catch (error) {
        console.error('Error creating todo:', error);
        return reply.status(500).send({ error: 'Failed to create todo' });
      }
    },

    getTodoById: async (
      request: FastifyRequest<{
        Params: {
          id: string;
        };
      }>,
      reply: FastifyReply,
    ): Promise<void> => {
      try {
        const { id } = request.params;
        const todoRepo = new TodoRepository(fastify.knex);
        const todo = await todoRepo.getById(id);
        if (todo) {
          reply.status(200).send({
            message: 'Todo found!',
            data: todo,
          });
        } else {
          reply.status(404).send({ error: 'Todo not found' });
        }
      } catch (error) {
        console.error('Error retrieving todo:', error);
        reply.status(500).send({ error: 'Failed to retrieve todo' });
      }
    },

    getAllTodos: async (
      request: FastifyRequest,
      reply: FastifyReply,
    ): Promise<void> => {
      try {
        const user = request.user;
        const todoRepo = new TodoRepository(fastify.knex);
        const todos = await todoRepo.getAll(user.id);
        reply.status(200).send({
          message: 'Todos fetched!',
          data: todos,
        });
      } catch (error) {
        console.error('Error retrieving todos:', error);
        reply.status(500).send({ error: 'Failed to retrieve todos' });
      }
    },

    updateTodo: async (
      request: FastifyRequest<{
        Body: TodoUpdateData;
        Params: { id: string };
      }>,
      reply: FastifyReply,
    ): Promise<void> => {
      try {
        const { id } = request.params;
        const updates = request.body;
        const todoRepo = new TodoRepository(fastify.knex);
        const success = await todoRepo.update(id, updates);
        if (success) {
          reply.status(200).send({ message: 'Todo Updated!', data: updates });
        } else {
          reply.status(404).send({ error: 'Todo not found' });
        }
      } catch (error) {
        console.error('Error updating todo:', error);
        reply.status(500).send({ error: 'Failed to update todo' });
      }
    },

    deleteTodo: async (
      request: FastifyRequest<{
        Params: {
          id: string;
        };
      }>,
      reply: FastifyReply,
    ): Promise<void> => {
      try {
        const { id } = request.params;
        const todoRepo = new TodoRepository(fastify.knex);
        const success = await todoRepo.delete(id);
        if (success) {
          reply.status(204).send();
        } else {
          reply.status(404).send({ error: 'Todo not found' });
        }
      } catch (error) {
        console.error('Error deleting todo:', error);
        reply.status(500).send({ error: 'Failed to delete todo' });
      }
    },
  };
}
