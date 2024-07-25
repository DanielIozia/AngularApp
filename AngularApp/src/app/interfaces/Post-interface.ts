import { Comment } from "./Comment-interface";
export interface Post {
    id?: number;
    user_id: number;
    title: string;
    body: string;
    comments?:Comment[];
}