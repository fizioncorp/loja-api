export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface AuthUser {
  userId: string;
  storeId: string;
  role: string;
  exp?: number;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}
