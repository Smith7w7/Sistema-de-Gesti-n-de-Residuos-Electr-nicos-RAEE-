export interface Cliente {
  id?: number;
  nombre: string;
  identificacion: string;
  email?: string;
  telefono?: string;
  tipo: 'NATURAL' | 'JURIDICO' | string;
}

