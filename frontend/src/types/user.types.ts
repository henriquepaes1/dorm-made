export interface User {
  id: string;
  name: string;
  email: string;
  university?: string | null;
  description?: string | null;
  profile_picture?: string | null;
  created_at: string;
}

export interface UserCreate {
  name: string;
  email: string;
  university: string;
  password: string;
}

export interface UserUpdate {
  university?: string | null;
  description?: string | null;
  profile_picture?: string | null;
}
