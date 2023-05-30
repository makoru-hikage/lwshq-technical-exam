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

}

export default NoteModule;
