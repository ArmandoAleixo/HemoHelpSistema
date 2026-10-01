import { recursos } from "../config/resources.js";
import { conectarBanco } from "../database/mongodb.js";
import { lerBody, responder } from "../http/http.js";
import {
  atualizarRecurso,
  buscarRecurso,
  criarRecurso,
  excluirRecurso,
  idValido,
  listarRecurso,
  validarDados,
} from "../repositories/resource-repository.js";

function localizarRecurso(pathname) {
  return recursos.find(
    (recurso) => pathname === recurso.caminho || pathname.startsWith(`${recurso.caminho}/`),
  );
}

export async function rotearApi(request, response) {
  if (request.method === "OPTIONS") {
    responder(response, 204, null);
    return;
  }

  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
  if (request.method === "GET" && url.pathname === "/api/health") {
    await conectarBanco();
    responder(response, 200, { status: "ok", banco: "conectado" });
    return;
  }

  const recurso = localizarRecurso(url.pathname);
  if (!recurso) {
    responder(response, 404, { erro: "Caminho da API nao encontrado." });
    return;
  }

  const id = decodeURIComponent(url.pathname.slice(recurso.caminho.length + 1));
  if (id.includes("/")) {
    responder(response, 404, { erro: "Caminho da API nao encontrado." });
    return;
  }

  if (request.method === "GET" && !id) {
    responder(response, 200, await listarRecurso(recurso));
    return;
  }

  if (request.method === "GET" && id) {
    const registro = await buscarRecurso(recurso, id);
    responder(response, registro ? 200 : 404, registro ?? { erro: "Registro nao encontrado." });
    return;
  }

  if (request.method === "DELETE" && id) {
    const excluido = await excluirRecurso(recurso, id);
    responder(
      response,
      excluido ? 200 : 404,
      excluido ? { mensagem: "Registro excluido." } : { erro: "Registro nao encontrado." },
    );
    return;
  }

  const body = await lerBody(request);
  const erroValidacao = validarDados(body, recurso.camposObrigatorios);
  if (erroValidacao) {
    responder(response, 400, { erro: erroValidacao });
    return;
  }

  if (request.method === "POST" && !id) {
    responder(response, 201, await criarRecurso(recurso, body));
    return;
  }

  if ((request.method === "PUT" || request.method === "PATCH") && id) {
    if (!idValido(id)) {
      responder(response, 400, { erro: "ID do registro invalido." });
      return;
    }
    const registro = await atualizarRecurso(recurso, id, body);
    responder(response, registro ? 200 : 404, registro ?? { erro: "Registro nao encontrado." });
    return;
  }

  responder(response, 405, { erro: "Metodo nao permitido." });
}
