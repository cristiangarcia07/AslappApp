import { IExamen } from '../exams/exam';

export interface Ordens {
  estado?: string;
  numRef?: string;
  fechaCrea?: string;
  total?: number;
  doctor?: {
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
  };
  exams?: IExamen;
  observaciones?: string;
  linkvital?: string;
  adjunto?: string;
  comision?: number;
  created?: string;
  createdDate?: Date;
  pagoRef?: string;
}
