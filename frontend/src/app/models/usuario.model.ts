export interface Usuario {
  username: string;
  rol: 'ROLE_ADMIN' | 'ROLE_VENDEDOR';
  token?: string;
  type?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  username: string;
  rol: 'ROLE_ADMIN' | 'ROLE_VENDEDOR';
}
