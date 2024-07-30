export interface Director {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Actor {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Genre {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Genre {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Movie {
  id: number;
  title: string;
  director: Director;
  actors: Actor[];
  genres: Genre[];
  series: string[];
  length: number;
  release_year: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  movie: Movie;
  user: User;
  rating: number;
  comment: string;
  reviewDate: number;
}

export interface User {
  id: number;
  username: string;
}

export interface SignUpData {
  username: string;
  password: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserFormData {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  credentials: { username: string; password: string };
  error: string;
  onSignUpClick: () => void;
}

// ### Help from ChatGPT

export interface SignUpFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: UserFormData; 
  error: string; 
  onLogInClick: () => void;
}

//##

export interface MoviesToSort {
  id: number;
  title: string;
  image_url: string;
  actors: string[];
  director: string;
  genres: string[];
  runtime: number;
}

// src/types.ts

export interface FavoriteMovie {
  id: number;
  user: User; 
  movie: Movie; 
}
export interface FavoriteActor {
  id: number;
  user: User; 
  actor: Actor; 
}
export interface FavoriteGenre {
  id: number;
  user: User; 
  genre: Genre; 
}
export interface FavoriteDirector {
  id: number;
  user: User; 
  director: Director; 
}
interface MovieDetailModalProps {
  userId: number;
  movieId?: string;
  open: boolean;
  handleClose: () => void;
}