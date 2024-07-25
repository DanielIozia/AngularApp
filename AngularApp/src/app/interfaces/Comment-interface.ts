// comment.interface.ts
export interface Comment {
    id?: number;
    postId: number;
    userId: number; // Aggiunto per identificare l'utente che ha scritto il commento
    name: string;
    email: string;
    body: string;
  }
  