export interface User {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  password?: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
}

export interface JwtAuthenticationResponse {
  jwt: string;
  email: string;
  role: string;
}
