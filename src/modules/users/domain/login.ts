import { User } from "./user";

export type Repository = {
  getUser(unique_id: string): Promise<User | null>;
  checkPassword(unique_id: string, password: string): Promise<boolean>;
}

export async function login (
  unique_id: string,
  password: string, 
  repository: Repository
): Promise<{
  code: number;
  message: string;
  data?: any;
}> {
  const user = await repository.getUser(unique_id) ?? null;

  if (!user) {
    return {
      code: 401,
      message: 'User does not exist.'
    }
  }

  const passwordMatch = await repository.checkPassword(unique_id, password);

  if (!passwordMatch) {
    return {
      code: 401,
      message: 'Access denied.'
    }
  }

  return {
    code: 200,
    message: 'Access granted',
    data: {
      id: user.id,
      email: user.email,
      name: user.name
    },
  };
}