import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import LoginRepository from "./adapters/login-repository";
import { login } from "./domain/login";

export default function UserController (fastify: FastifyInstance) {
  return {
    async login (request: FastifyRequest<{ Body: { email: string; password: string }}>, reply: FastifyReply) {
      const knex = fastify.knex;
  
      const loginRepository = new LoginRepository(knex);
  
      const { email, password } = request.body;
  
      return login(email, password, loginRepository);
    }
  }
}