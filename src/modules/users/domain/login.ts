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
  const user = repository.getUser(unique_id);

  if (!user) {
    return {
      code: 401,
      message: 'User does not exist.'
    }
  }

  if (!repository.checkPassword(unique_id, password)) {
    return {
      code: 401,
      message: 'Access denied.'
    }
  }

  return {
    code: 200,
    message: 'Access granted',
    data: user,
  };
}