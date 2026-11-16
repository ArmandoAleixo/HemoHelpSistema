import { ObjectId } from "mongodb";
import { recursos } from "../config/resources.js";
import { conectarBanco, obterColecao } from "../database/mongodb.js";
import { lerBody, origemPermitida, responder } from "../http/http.js";
import {
  cookieSessao,
  cookieSessaoExpirada,
  criarHashSenha,
  encerrarSessao,
  iniciarSessao,
  usuarioDaSessao,
  verificarSenha,
} from "../services/auth.js";
import {
  enviarImagemCampanha,
  excluirImagemCampanha,
  verificarCloudinary,
} from "../services/cloudinary.js";
import {
  atualizarRecurso,
  buscarRecurso,
  criarRecurso,
  excluirRecurso,
  idValido,
  listarRecurso,
  validarDados,
  validarRelacionamentos,
} from "../repositories/resource-repository.js";

function localizarRecurso(pathname) {
  return recursos.find(
    (recurso) => pathname === recurso.caminho || pathname.startsWith(`${recurso.caminho}/`),
  );
}

export async function rotearApi(request, response) {
  if (!origemPermitida(request)) {
    responder(response, 403, { erro: "Origem nao permitida." });
    return;
  }
  if (request.method === "OPTIONS") {
    responder(response, 204, null);
    return;
  }

  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
  if (url.pathname === "/api/auth/login" && request.method === "POST") {
    const body = await lerBody(request);
    const nomeUsuario = typeof body.nomeUsuario === "string" ? body.nomeUsuario.trim() : "";
    const senha = typeof body.senha === "string" ? body.senha : "";
    const chaveAba = typeof body.chaveAba === "string" ? body.chaveAba : "";
    if (!nomeUsuario || !senha || !/^[a-f\d]{64}$/i.test(chaveAba)) {
      responder(response, 400, { erro: "Informe o usuario e a senha." });
      return;
    }
    const usuario = await (await obterColecao("Usuarios")).findOne({ nomeUsuario });
    if (!usuario || !verificarSenha(senha, usuario.senhaHash)) {
      responder(response, 401, { erro: "Usuario ou senha incorretos." });
      return;
    }
    const token = await iniciarSessao(usuario, chaveAba);
    responder(response, 200, { usuario: { id: String(usuario._id), nomeUsuario: usuario.nomeUsuario } }, {
      "set-cookie": cookieSessao(request, token),
    });
    return;
  }

  if (url.pathname === "/api/auth/me" && request.method === "GET") {
    const usuario = await usuarioDaSessao(request);
    responder(
      response,
      usuario ? 200 : 401,
      usuario
        ? { usuario: { id: String(usuario._id), nomeUsuario: usuario.nomeUsuario } }
        : { erro: "Sessao invalida ou expirada." },
    );
    return;
  }

  if (url.pathname === "/api/auth/logout" && request.method === "POST") {
    await encerrarSessao(request);
    responder(response, 200, { mensagem: "Sessao encerrada." }, {
      "set-cookie": cookieSessaoExpirada(request),
    });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/health") {
    await conectarBanco();
    responder(response, 200, { status: "ok", banco: "conectado" });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/cloudinary/health") {
    await verificarCloudinary();
    responder(response, 200, { status: "ok", cloudinary: "conectado", folder: "Campanhas" });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/campanhas/imagem") {
    const { imagem } = await lerBody(request);
    responder(response, 201, await enviarImagemCampanha(imagem));
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
    if (recurso.colecao === "Campanhas") {
      const campanha = await buscarRecurso(recurso, id);
      if (!campanha) {
        responder(response, 404, { erro: "Registro nao encontrado." });
        return;
      }
      await excluirImagemCampanha(campanha.imagemPublicId);
    }
    const excluido = await excluirRecurso(recurso, id);
    responder(
      response,
      excluido ? 200 : 404,
      excluido ? { mensagem: "Registro excluido." } : { erro: "Registro nao encontrado." },
    );
    return;
  }

  const body = await lerBody(request);
  if (recurso.colecao === "Usuarios") {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      responder(response, 400, { erro: "O corpo da requisicao deve ser um objeto JSON." });
      return;
    }
    const senha = typeof body.senha === "string" ? body.senha : "";
    if (request.method === "POST" && !senha.trim()) {
      responder(response, 400, { erro: "A senha e obrigatoria para cadastrar um usuario." });
      return;
    }
    const nomeUsuario = typeof body.nomeUsuario === "string" ? body.nomeUsuario.trim() : "";
    if (!nomeUsuario) {
      responder(response, 400, { erro: "O nome de usuario e obrigatorio." });
      return;
    }
    const usuarios = await obterColecao("Usuarios");
    const usuarioExistente = await usuarios.findOne({ nomeUsuario });
    if (usuarioExistente && (!id || String(usuarioExistente._id) !== id)) {
      responder(response, 409, { erro: "Este nome de usuario ja esta cadastrado." });
      return;
    }
    body.nomeUsuario = nomeUsuario;
    delete body.senha;
    delete body.senhaHash;
    if (senha) body.senhaHash = criarHashSenha(senha);
    if (!senha && (request.method === "PUT" || request.method === "PATCH")) {
      if (!id || !/^[a-f\d]{24}$/i.test(id)) {
        responder(response, 400, { erro: "ID do registro invalido." });
        return;
      }
      const atual = await usuarios.findOne({ _id: new ObjectId(id) });
      if (!atual) {
        responder(response, 404, { erro: "Registro nao encontrado." });
        return;
      }
    }
  }
  const erroValidacao = validarDados(body, recurso.camposObrigatorios);
  if (erroValidacao) {
    responder(response, 400, { erro: erroValidacao });
    return;
  }

  const erroRelacionamento = await validarRelacionamentos(recurso, body);
  if (erroRelacionamento) {
    responder(response, 400, { erro: erroRelacionamento });
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
