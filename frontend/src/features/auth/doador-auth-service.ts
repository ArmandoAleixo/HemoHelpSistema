// Autenticação do doador: cadastro, login, perfil e controle do token no localStorage.
const CHAVE_TOKEN = "hemohelp_doador_token";

const apiBaseUrl = (import.meta.env["VITE_API_URL"] ?? "http://localhost:3001/api").replace(
  /\/$/,
  "",
);

export type Doador = {
  id: string;
  nome: string;
  email: string;
  tipoSanguineo?: string;
  // O hemocentro confirma o tipo sanguíneo na primeira doação.
  tipoSanguineoVerificado?: boolean;
  cpf?: string;
  telefone?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type DadosCadastro = {
  nome: string;
  email: string;
  tipoSanguineo: string;
  senha: string;
  cpf: string;
  telefone?: string;
};

export type DadosPerfil = {
  nome?: string;
  email?: string;
  telefone?: string;
};

export type DadosSenha = {
  senhaAtual: string;
  novaSenha: string;
};

export type DadosLogin = {
  email: string;
  senha: string;
};

export type RespostaLogin = {
  token: string;
  doador: Doador;
};

// Erro com o status HTTP, para o chamador tratar 401 (sessão expirada) e 409
// (e-mail já cadastrado) de forma específica.
export class ErroApi extends Error {
  readonly status: number;

  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.name = "ErroApi";
    this.status = status;
  }
}

async function requisicao<T>(caminho: string, init?: RequestInit): Promise<T> {
  let resposta: Response;

  try {
    resposta = await fetch(`${apiBaseUrl}${caminho}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ErroApi("Não foi possível conectar ao servidor. Tente novamente.", 0);
  }

  const corpo = (await resposta.json().catch(() => ({}))) as { erro?: string };

  if (!resposta.ok) {
    throw new ErroApi(
      corpo.erro ?? `A API respondeu com status ${resposta.status}.`,
      resposta.status,
    );
  }

  return corpo as T;
}

export function cadastrarDoador(dados: DadosCadastro) {
  return requisicao<Doador>("/doador/cadastro", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function loginDoador(dados: DadosLogin) {
  return requisicao<RespostaLogin>("/doador/login", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function buscarPerfilDoador() {
  const token = lerToken();
  if (!token) {
    return Promise.reject(new ErroApi("Sessão expirada. Entre novamente.", 401));
  }

  return requisicao<Doador>("/doador/perfil", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Monta o cabeçalho das rotas protegidas. Sem token, a sessão já expirou.
function comToken(init?: RequestInit): RequestInit {
  const token = lerToken();
  if (!token) {
    throw new ErroApi("Sessão expirada. Entre novamente.", 401);
  }

  return { ...init, headers: { ...init?.headers, Authorization: `Bearer ${token}` } };
}

export function atualizarPerfilDoador(dados: DadosPerfil) {
  return requisicao<Doador>(
    "/doador/perfil",
    comToken({ method: "PATCH", body: JSON.stringify(dados) }),
  );
}

export function alterarSenhaDoador(dados: DadosSenha) {
  return requisicao<{ mensagem: string }>(
    "/doador/senha",
    comToken({ method: "PATCH", body: JSON.stringify(dados) }),
  );
}

export function salvarToken(token: string) {
  window.localStorage.setItem(CHAVE_TOKEN, token);
}

export function lerToken(): string | null {
  // No servidor não existe localStorage.
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CHAVE_TOKEN);
}

export function removerToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CHAVE_TOKEN);
}
