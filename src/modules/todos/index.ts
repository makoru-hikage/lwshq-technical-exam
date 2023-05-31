import { FastifyInstance, FastifyPluginAsync } from "fastify";
import TodoController from "./controller";


const TodoModule: FastifyPluginAsync = async (fastify: FastifyInstance, opts) => {
  const controller = TodoController(fastify);

  fastify.route({
    method: 'POST',
    url: '/',
    handler: controller.createTodo,
    preHandler: fastify.authenticate
  })

  fastify.route({
    method: 'GET',
    url: '/',
    handler: controller.getAllTodos,
    preHandler: fastify.authenticate
  })

  fastify.route({
    method: 'GET',
    url: '/:id',
    handler: controller.getTodoById,
    preHandler: fastify.authenticate
  })

  fastify.route({
    method: 'PATCH',
    url: '/:id',
    handler: controller.updateTodo,
    preHandler: fastify.authenticate
  })

  fastify.route({
    method: 'DELETE',
    url: '/:id',
    handler: controller.deleteTodo,
    preHandler: fastify.authenticate
  })
}

export default TodoModule;
