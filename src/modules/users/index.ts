import UserController from "./controller";

import { FastifyPluginAsync } from 'fastify';

const userModule: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

  const controller = UserController(fastify);

  fastify.post('/login', controller.login);
}

export default userModule;