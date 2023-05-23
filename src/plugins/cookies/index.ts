import fastifyCookie, { CookieSerializeOptions, FastifyCookieOptions } from "@fastify/cookie";
import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify'


/**
 * This plugin enables the use of cookies.
 *
 * @see https://github.com/fastify/fastify-sensible
 */
const cookiePlugin: FastifyPluginAsync = fp<FastifyCookieOptions>(async (fastify) => {
  await fastify.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET || 'S3Cr3t!!',
  });

  fastify.log.info('COOKIE PLUGIN LOADED');
}, {
  // The plugin name shall not coincide with any of the decorator names
  // I made the mistake of naming this just 'cookie' and it caused a 
  // 'not a function' error.
  name: 'cookie-plugin'
})

export default cookiePlugin;

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  interface FastifyRequest {
    cookies: { [cookieName: string]: string | undefined; }
  }

  interface FastifyReply {
    setCookie: (name: string, value: string, options?: CookieSerializeOptions | undefined) => this;
    cookie: (name: string, value: string, options?: CookieSerializeOptions | undefined) => this;
  }
}