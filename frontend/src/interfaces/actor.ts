import { Movie } from "./movie";

export interface Actor {
    id?: string;
    firstName: string | undefined;
    lastName: string | undefined;
    gender: string| undefined;
    age: number | undefined;
    imageURL?: string;
    
}

export interface ActorDetails {
    id?: string;
    firstName: string | undefined;
    lastName: string | undefined;
    gender: string | undefined;
    age: number| undefined;
    imageURL?: string;
    movies?: Movie[];
    
}