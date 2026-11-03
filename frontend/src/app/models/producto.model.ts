import { Categoria } from './categoria.model';

export interface Producto {
  id?: number;
  nombre: string;
  marca?: string;
  modelo?: string;
  estado?: 'RECIBIDO' | 'OPERATIVO' | 'EN_MANTENIMIENTO' | 'BAJA' | string;
  precio: number;
  stock: number;
  fechaRegistro?: string;
  categoria?: Categoria;
}

