import type { Registro } from "./models";

export const TIPOS_SANGUINEOS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
export const LIMITE_ESTOQUE_CRITICO = 20;

export function obterPorcentagemEstoque(registro: Registro) {
  return Number(registro["porcentagem"] ?? registro["quantidade"] ?? 0);
}

export function estoqueEstaCritico(percentual: number) {
  return percentual < LIMITE_ESTOQUE_CRITICO;
}

export function obterStatusEstoque(registro: Registro) {
  return estoqueEstaCritico(obterPorcentagemEstoque(registro)) ? "Estoque crítico" : "Disponível";
}
