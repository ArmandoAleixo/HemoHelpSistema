import type { AreaKey, Registro } from "../domain/models";

const apiBaseUrl = (import.meta.env["VITE_API_URL"] ?? "http://localhost:3001/api").replace(
  /\/$/,
  "",
);

const caminhos: Record<AreaKey, string> = {
  estoque: "estoque",
  unidades: "unidades-moveis",
  locais: "locais-coleta",
  parcerias: "parcerias",
  campanhas: "campanhas",
  doadores: "doadores",
  agentes: "agentes",
};

function endpoint(area: AreaKey) {
  return `${apiBaseUrl}/${caminhos[area]}`;
}

async function requisicao<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { erro?: string };
    throw new Error(body.erro ?? `A API respondeu com status ${response.status}.`);
  }

  return (await response.json()) as T;
}

export function listar(area: AreaKey) {
  return requisicao<Registro[]>(endpoint(area));
}

export function salvar(area: AreaKey, registro: Registro) {
  const idMongo = /^[a-f\d]{24}$/i.test(registro.id);
  return requisicao<Registro>(idMongo ? `${endpoint(area)}/${registro.id}` : endpoint(area), {
    method: idMongo ? "PUT" : "POST",
    body: JSON.stringify(registro),
  });
}

export async function excluir(area: AreaKey, id: string) {
  if (!/^[a-f\d]{24}$/i.test(id)) return;
  await requisicao(`${endpoint(area)}/${id}`, { method: "DELETE" });
}
