// PROVISÓRIO: autenticação simulada. A sessão fica no localStorage e qualquer
// e-mail/senha preenchidos são aceitos. Será substituída pela autenticação da API.
import { useCallback, useSyncExternalStore } from "react";

const CHAVE_SESSAO = "hemohelp.sessao";
const EVENTO_SESSAO = "hemohelp:sessao";

export type Sessao = {
  email: string;
  nome: string;
};

function nomeAPartirDoEmail(email: string) {
  const [local] = email.split("@");
  if (!local) return email;

  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(" ");
}

function lerSessao(): Sessao | null {
  if (typeof window === "undefined") return null;

  try {
    const bruto = window.localStorage.getItem(CHAVE_SESSAO);
    if (!bruto) return null;

    const dados = JSON.parse(bruto) as Partial<Sessao>;
    if (typeof dados.email !== "string" || !dados.email) return null;

    return {
      email: dados.email,
      nome: typeof dados.nome === "string" && dados.nome ? dados.nome : dados.email,
    };
  } catch {
    return null;
  }
}

function inscrever(ouvinte: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", ouvinte);
  window.addEventListener(EVENTO_SESSAO, ouvinte);

  return () => {
    window.removeEventListener("storage", ouvinte);
    window.removeEventListener(EVENTO_SESSAO, ouvinte);
  };
}

// Mantém a mesma referência entre renderizações para o useSyncExternalStore.
let cacheBruto: string | null = null;
let cacheSessao: Sessao | null = null;

function snapshot() {
  if (typeof window === "undefined") return null;

  const bruto = window.localStorage.getItem(CHAVE_SESSAO);
  if (bruto === cacheBruto) return cacheSessao;

  cacheBruto = bruto;
  cacheSessao = lerSessao();
  return cacheSessao;
}

function snapshotServidor() {
  return null;
}

export function estaAutenticado() {
  // No servidor não existe localStorage: a verificação real acontece no cliente.
  if (typeof window === "undefined") return true;
  return snapshot() !== null;
}

export function entrar(email: string, _senha: string) {
  const emailNormalizado = email.trim();
  const sessao: Sessao = {
    email: emailNormalizado,
    nome: nomeAPartirDoEmail(emailNormalizado),
  };

  window.localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
  window.dispatchEvent(new Event(EVENTO_SESSAO));
}

export function sair() {
  window.localStorage.removeItem(CHAVE_SESSAO);
  window.dispatchEvent(new Event(EVENTO_SESSAO));
}

export function useAuth() {
  const sessao = useSyncExternalStore(inscrever, snapshot, snapshotServidor);

  const efetuarLogin = useCallback((email: string, senha: string) => entrar(email, senha), []);
  const efetuarLogout = useCallback(() => sair(), []);

  return {
    sessao,
    autenticado: sessao !== null,
    entrar: efetuarLogin,
    sair: efetuarLogout,
  };
}
