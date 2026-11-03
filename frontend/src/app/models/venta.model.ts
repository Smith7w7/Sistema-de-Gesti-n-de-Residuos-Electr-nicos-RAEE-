import { Cliente } from './cliente.model';
import { Producto } from './producto.model';

export interface DetalleVenta {
  id?: number;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Venta {
  id?: number;
  fechaVenta?: string;
  total: number;
  estado?: 'EMITIDA' | 'PAGADA' | 'ANULADA' | string;
  cliente: Cliente;
  detalles: DetalleVenta[];
}

