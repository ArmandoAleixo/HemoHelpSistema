import { lerBody, responder } from "../http/http.js";
import { autenticarDoador } from "../middlewares/autenticarDoador.js";
import { buscarDoadorPorId, cadastrar, login } from "../services/doadorAuthService.js";

const CAMINHOS = Object.freeze({
  cadastro: "/api/doador/cadastro",
  login: "/api/doador/login",
  perfil: "/api/doador/perfil",
});

export async function rotearDoador(request, response, url) {
  const caminho = url.pathname.replace(/\/+$/, "");

  if (request.method === "POST" && caminho === CAMINHOS.cadastro) {
    const resultado = await cadastrar(await lerBody(request));
    responder(response, resultado.status, resultado.body);
    return;
  }

  if (request.method === "POST" && caminho === CAMINHOS.login) {
    const resultado = await login(await lerBody(request));
    responder(response, resultado.status, resultado.body);
    return;
  }

  if (request.method === "GET" && caminho === CAMINHOS.perfil) {
    if (!autenticarDoador(request, response)) return;

    const doador = await buscarDoadorPorId(request.doadorId);
    responder(response, doador ? 200 : 401, doador ?? { erro: "Token inválido ou expirado." });
    return;
  }

  if (Object.values(CAMINHOS).includes(caminho)) {
    responder(response, 405, { erro: "Método não permitido." });
    return;
  }

  responder(response, 404, { erro: "Caminho da API não encontrado." });
}
