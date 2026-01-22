export interface Ubicacion {
    id: number;
    nombre: string;
    direccion: string;
    fecha_movimiento: string;
}

export interface Contenedor {
    id: number;
    codigo: string;
    tipo_contenedor: string;
    estado: boolean;
    capacidad: number;
    ubicacion_id?: number;
    ubicacion?: Ubicacion;
}

export interface Cliente {
    id: number;
    nombre: string;
    numero_identificacion: number;
    telefono: string;
}

export interface Movimiento {
    id: number;
    id_contenedor: number;
    id_ubicacion: number;
    id_cliente: number;
    fecha_movimiento: string;
    movimiento_registrado: string;
    contenedor?: Contenedor;
    ubicacion?: Ubicacion;
    cliente?: Cliente;
}

export interface Usuario {
    id: number;
    nombre: string;
    email?: string;
    rol: string;
    movimiento_id?: number;
}

export interface ApiResponse<T> {
    status: 'success' | 'error';
    message?: string;
    data?: T;
    errors?: any;
}
