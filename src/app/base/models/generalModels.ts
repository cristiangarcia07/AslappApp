/* eslint-disable @typescript-eslint/naming-convention */
export interface User {
    uid?: string | null;
    email?: string | null;
    nombre?: string | null;
    password?: string | null;
    rol?: string | null;
    cc?: string | null;
    balance?: number | null;
    referido?: string | null;
    convenio?: string | null;
}

export class Cart {
    item?: ExamenModel;
    quantity?: string;
}

export class ExamenModel {
    id?: string;
    EXAMEN?: string;
    SINONIMO?: string;
    REMISION?: string;
    AYUNO?: string;
    CUPS?: string;
    MUESTRA?: string;
    ESTABILIDAD?: string;
    UTILIDAD_CLINICA?: string;
    TIEMPO?: string;
    PRECIO?: string;
    PREPARACION?: string;
    COMISION?: string;
    CATEGORIA?: string;
    NOMBRE_OMS?: string;
}

export class Users {
    id?: string;
    email?: string;
    nombre?: string;
    password?: string;
    rol?: string;
    cc?: string;
    balance?: number;
    uid?: string;
    convenio?: string;
    referido?: string;
}

export class Ordens {
    estado?: string;
    numRef?: string;
    fechaCrea?: string;
    total?: number;
    doctor?: Users;
    exams?: ExamenModel;
    observaciones?: string;
    linkvital?: string;
    adjunto?: string;
    comision?: number;
    created?: string;
    createdDate?: Date;
    pagoRef?: string;
}

export class Transaction {
    ITEMID?: string;
    UIDUSER?: string;
    VALOR?: string;
    ESTADO?: string;
    EMAILUSER?: string;
    PRODUCTO?: string;
}

export class Product {
    id?: string;
    NOMBRE?: string;
    VALOR?: string;
    DESCRIPCION?: string;
    IMG?: string;
}

export class bussiness {
    nombre?: string;
    nit?: string;
    numerocontac?: string;
    correo?: string;
    telefono?: string;
    direccion?: string;
    rut?: string;
}

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export class site {
    id?: string;
    nombre?: string;
    dias?: number[];
    disabledays?: Date[];
    direccion?: string;
}
