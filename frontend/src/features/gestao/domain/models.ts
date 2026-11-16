export type Registro = { id: string; [key: string]: string };

export type AreaKey =
  "estoque" | "unidades" | "locais" | "campanhas" | "doadores" | "agentes" | "usuarios";

export type Campo = {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "file" | "password";
  options?: string[];
};

export type Area = {
  key: AreaKey;
  nome: string;
  singular: string;
  descricao: string;
  campos: Campo[];
};
