export interface User {
    id: number;
    name: string;
    email: string;
    gender: 'male' | 'female';  // Utilizza un'unione di stringhe per valori specifici
    status: 'active' | 'inactive'; // Utilizza un'unione di stringhe per valori specifici
  }