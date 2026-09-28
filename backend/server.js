import http from "node:http";
import { fileURLToPath } from "node:url";
import { conectarBanco } from "./BancoDeDados.js";
import { cadastroAgentes } from "./CadastroAgentes.js";
import { cadastroDoadores } from "./CadastroDoadores.js";
import { campanhas } from "./Campanhas.js";
import { estoque } from "./Estoque.js";
import { locaisColeta } from "./LocaisColeta.js";
import { parcerias } from "./Parceirias.js";
import { unidadesMoveis } from "./UnidadesMoveis.js";
import {
  atualizarRecurso,
  buscarRecurso,
  criarRecurso,
  excluirRecurso,
  idValido,
  listarRecurso,
  validarDados,
} from "./recurso.js";

const recursos = [
  cadastroDoadores,
  cadastroAgentes,
  campanhas,
  estoque,
  locaisColeta,
  parcerias,
  unidadesMoveis,
];
const port = Number(process.env.PORT ?? 3001);

function responder(response, status, body) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "Content-Type",
    "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  });
  response.end(JSON.stringify(body));
}

async function lerBody(request) {
  const partes = [];
  for await (const parte of request) partes.push(parte);
  if (partes.length === 0) return {};

  try {
    return JSON.parse(Buffer.concat(partes).toString("utf8"));
  } catch {
    throw new Error("O corpo da requisicao precisa ser um JSON valido.");
  }
}

async function tratarRequisicao(request, response) {
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

  const recurso = recursos.find(
    (item) => url.pathname === item.caminho || url.pathname.startsWith(`${item.caminho}/`),
  );
  if (!recurso) {
    responder(response, 404, { erro: "Caminho da API nao encontrado." });
    return;
  }

  const id = url.pathname.slice(recurso.caminho.length + 1);
  if (id.includes("/")) {
    responder(response, 404, { erro: "Caminho da API nao encontrado." });
    return;
  }

  if (request.method === "GET" && !id) {
    responder(response, 200, await listarRecurso(recurso));
    return;
  }

  if (request.method === "GET" && id) {
    const registro = await buscarRecurso(recurso, decodeURIComponent(id));
    responder(response, registro ? 200 : 404, registro ?? { erro: "Registro nao encontrado." });
    return;
  }

  if (request.method === "DELETE" && id) {
    const excluido = await excluirRecurso(recurso, decodeURIComponent(id));
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
    if (!idValido(decodeURIComponent(id))) {
      responder(response, 400, { erro: "ID do registro invalido." });
      return;
    }
    const registro = await atualizarRecurso(recurso, decodeURIComponent(id), body);
    responder(response, registro ? 200 : 404, registro ?? { erro: "Registro nao encontrado." });
    return;
  }

  responder(response, 405, { erro: "Metodo nao permitido." });
}

const server = http.createServer((request, response) => {
  tratarRequisicao(request, response).catch((error) => {
    console.error(error);
    responder(response, 500, { erro: error.message || "Erro interno do servidor." });
  });
});

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === fileURLToPath(`file://${process.argv[1]}`)
) {
  server.listen(port, () => console.log(`API HemoHelp em http://localhost:${port}`));
}

export { server };
