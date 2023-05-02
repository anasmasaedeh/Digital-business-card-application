import { Document } from "mongoose";


export interface CategoryItem {
  username: string;
  title: string;
}

export interface User extends Document {

  fullName: string;

  email: string;
  
  password: string;
  
  role: string;
  
  isValid: boolean;
  

  profilePicture: string;
  
  
  birthDate: Date;
  
}
