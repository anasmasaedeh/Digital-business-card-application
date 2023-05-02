export enum UserRole {
    ADMIN= 'admin',
    USER = 'user',
  }
  
  export interface Category {
    id: number;
    name: string;
    description: string;
  }
  export interface UserSummary {
    fullName: string;
    email: string;
    position: string;
    company: string;
  }
  
  