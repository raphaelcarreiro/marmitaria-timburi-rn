import { Address } from './address';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string | null;
  addresses: Address[];
}
