export interface JwtPayload {
    sub: string;
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
    iat?: number;
    exp?: number;
  }
  