export default {
  type: 'object',
  properties: {
    HOST: {
      type: 'string',
      default: '127.0.0.1'
    },
    PORT: {
      type: 'number',
      default: 8000
    },
    DB_HOST: {
      type: 'string',
      default: '127.0.0.1'
    },
    DB_PORT: {
      type: 'number',
      default: 5432
    },
    DB_NAME: {
      type: 'string',
      default: 'todo_local'
    },
    // Create a separate DB user for dev or prod
    DB_USERNAME: {
      type: 'string',
      default: 'postgres'
    },
    DB_PASSWORD: {
      type: 'string',
      default: ''
    },
  }
}

declare module 'fastify' {
  export interface FastifyInstance {
    env: {
      HOST: string;
      PORT: number;
      DB_HOST: string;
      DB_PORT: number;
      DB_NAME: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
    };
  }
}
