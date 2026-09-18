export interface User {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
  error: object;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface DecodedToken {
  id: number;
  email: string;
  role?: string;
  iat: number;
  exp: number;
}
