// Interfaces based on the swagger.json file
export interface Livsmedel {
  namn: string;
  nummer: number;
  varden: Naringsvarde[];
  livsmedelsgrupp?: string;
  livsmedelsgrupp_id?: number;
  livsmedelstatus?: string;
  _links?: Link[];
}

export interface Livsmedelsida {
  _meta: Meta;
  _links?: Link[];
  livsmedel: Livsmedel[];
}

export interface Naringsvarde {
  namn: string;
  euroFIRkod?: string;
  forkortning?: string;
  varde: number;
  enhet?: string;
  sort?: string;
  portion?: string;
  vardeTyp?: string;
  ursprung?: string;
  publikationsreferens?: string;
  metodtyp?: string;
  framtagningsmetod?: string;
  metodbeskrivning?: string;
}

export interface Meta {
  totalRecords: number;
  offset: number;
  limit: number;
  count: number;
}

export interface Link {
  href: string;
  rel: string;
  method: string;
}

export enum Sprak {
  Svenska = 1,
  Engelska = 2
}
