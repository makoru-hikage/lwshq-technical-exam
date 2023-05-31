import { FastifyInstance, FastifyPluginAsync } from "fastify";
import NoteController from "./controller";

const NoteModule: FastifyPluginAsync = async (fastify: FastifyInstance, opts) => {

  const controller = NoteController(fastify);

  fastify.route({
    method: 'POST',
    url: '/',
    handler: controller.createNote,
    preHandler: fastify.authenticate
  })

  fastify.route({
    method: 'GET',
    url: '/',
    handler: controller.getAllNotes,
    preHandler: fastify.authenticate
  })

  fastify.route({
    method: 'GET',
    url: '/:id',
    handler: controller.getNoteById,
    preHandler: fastify.authenticate
  })

  fastify.route({
    method: 'PATCH',
    url: '/:id',
    handler: controller.updateNote,
    preHandler: fastify.authenticate
  })

  fastify.route({
    method: 'DELETE',
    url: '/:id',
    handler: controller.deleteNote,
    preHandler: fastify.authenticate
  })
}

export default NoteModule;
