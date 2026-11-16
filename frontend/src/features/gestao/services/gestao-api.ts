import type { AreaKey, Registro } from "../domain/models";

const apiBaseUrl = (import.meta.env["VITE_API_URL"] ?? "http://localhost:3001/api").replace(
  /\/$/,
  "",
);
const CHAVE_SESSAO_ABA = "hemohelp-chave-aba";

export function obterChaveAba() {
  return typeof window === "undefined" ? null : sessionStorage.getItem(CHAVE_SESSAO_ABA);
}

export function limparChaveAba() {
  if (typeof window !== "undefined") sessionStorage.removeItem(CHAVE_SESSAO_ABA);
}

const caminhos: Record<AreaKey, string> = {
  estoque: "estoque",
  unidades: "unidades-moveis",
  locais: "locais-coleta",
  campanhas: "campanhas",
  doadores: "doadores",
  agentes: "agentes",
  usuarios: "usuarios",
};

function endpoint(area: AreaKey) {
  return `${apiBaseUrl}/${caminhos[area]}`;
}

async function requisicao<T>(url: string, init?: RequestInit): Promise<T> {
  const chaveAba = obterChaveAba();
  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(chaveAba ? { "X-Session-Tab": chaveAba } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401 && !url.includes("/auth/") && typeof window !== "undefined") {
      window.dispatchEvent(new Event("hemohelp:sessao-expirada"));
    }
    const body = (await response.json().catch(() => ({}))) as { erro?: string };
    throw new Error(body.erro ?? `A API respondeu com status ${response.status}.`);
  }

  return (await response.json()) as T;
}

export type UsuarioSessao = { id: string; nomeUsuario: string };

export function obterSessao() {
  if (!obterChaveAba()) return Promise.reject(new Error("Sessao desta aba encerrada."));
  return requisicao<{ usuario: UsuarioSessao }>(`${apiBaseUrl}/auth/me`);
}

export async function entrar(nomeUsuario: string, senha: string) {
  const chaveAba = Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  const resposta = await requisicao<{ usuario: UsuarioSessao }>(`${apiBaseUrl}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ nomeUsuario, senha, chaveAba }),
  });
  sessionStorage.setItem(CHAVE_SESSAO_ABA, chaveAba);
  return resposta;
}

export async function sair() {
  const resposta = await requisicao<{ mensagem: string }>(`${apiBaseUrl}/auth/logout`, {
    method: "POST",
  });
  limparChaveAba();
  return resposta;
}

export function sairAoFechar() {
  if (!obterChaveAba()) return;
  limparChaveAba();
  void fetch(`${apiBaseUrl}/auth/logout`, {
    method: "POST",
    credentials: "include",
    keepalive: true,
  }).catch(() => {});
}

export function listar(area: AreaKey) {
  return requisicao<Registro[]>(endpoint(area));
}

export function buscar(area: AreaKey, id: string) {
  return requisicao<Registro>(`${endpoint(area)}/${encodeURIComponent(id)}`);
}

export function salvar(area: AreaKey, registro: Registro) {
  const idMongo = /^[a-f\d]{24}$/i.test(registro.id);
  return requisicao<Registro>(idMongo ? `${endpoint(area)}/${registro.id}` : endpoint(area), {
    method: idMongo ? "PUT" : "POST",
    body: JSON.stringify(registro),
  });
}

export function enviarImagemCampanha(imagem: string) {
  return requisicao<{ imagemUrl: string; imagemPublicId: string }>(
    `${apiBaseUrl}/campanhas/imagem`,
    { method: "POST", body: JSON.stringify({ imagem }) },
  );
}

export async function excluir(area: AreaKey, id: string) {
  if (!/^[a-f\d]{24}$/i.test(id)) return;
  await requisicao(`${endpoint(area)}/${id}`, { method: "DELETE" });
}
