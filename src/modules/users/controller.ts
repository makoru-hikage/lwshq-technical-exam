import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import LoginRepository from "./adapters/login-repository";
import { login } from "./domain/login";

export default function UserController (fastify: FastifyInstance) {
  return {
    async login (request: FastifyRequest<{ Body: { email: string; password: string }}>, reply: FastifyReply) {
      const knex = fastify.knex;
  
      const loginRepository = new LoginRepository(knex);
  
      const { email, password } = request.body;

      const loginResult = await login(email, password, loginRepository);

      if (loginResult.code !== 200){
        return reply.unauthorized(loginResult.message);
      }

      const token = await reply.jwtSign(loginResult.data);

      return reply.cookie('logged_user', token, {
        httpOnly: true,
        sameSite: 'none',
        maxAge: 3600 //This is in seconds
      }).send(loginResult);
    }
  }
}