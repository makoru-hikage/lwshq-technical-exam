import UserController from "./controller";

import { FastifyPluginAsync } from 'fastify';

const UserModule: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

  const controller = UserController(fastify);

  fastify.post('/login', controller.login);
  fastify.post('/logout', controller.logout);
}

export default UserModule;