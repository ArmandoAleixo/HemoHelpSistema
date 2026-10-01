export type Registro = { id: string; [key: string]: string };

export type AreaKey =
  "estoque" | "unidades" | "locais" | "parcerias" | "campanhas" | "doadores" | "agentes";

export type Campo = {
  key: string;
  label: string;
  type?: "text" | "number" | "date";
  options?: string[];
};

export type Area = {
  key: AreaKey;
  nome: string;
  singular: string;
  descricao: string;
  campos: Campo[];
};
