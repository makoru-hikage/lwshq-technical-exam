Architectural rules:
- The only `import`s you can make in a file in any `domain` folder can only start in `./`.
- Files in the `adapters` folder shall be framework-agnostic. Meaning, NONE shall need or interface a FastifyInstance. Any 3rd-party libraries are a fair game and so do any files in the `domain` folder.
- A folder in the `modules` folder shall be called a `module`. Any file in a `module` shall not import any file from another `module`.
- As much as possible, the functions in the `plugins` folder shall pass through the `fastify` instance.