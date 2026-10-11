import { ObjectId } from "mongodb";
import { relacionamentos } from "../config/relationships.js";
import { obterColecao } from "../database/mongodb.js";

export function idValido(id) {
  return ObjectId.isValid(id);
}

function relacionamentosDoRecurso(config) {
  return relacionamentos.filter(({ colecao }) => colecao === config.colecao);
}

function paraResposta(documento, config) {
  const { _id, ...dados } = documento;
  for (const { campo } of relacionamentosDoRecurso(config)) {
    if (dados[campo] instanceof ObjectId) dados[campo] = String(dados[campo]);
  }
  return { id: String(_id), ...dados };
}

function limparDados(body, config) {
  const dados = { ...body };
  delete dados._id;
  delete dados.id;
  delete dados.createdAt;
  delete dados.updatedAt;
  for (const { campo } of relacionamentosDoRecurso(config)) {
    if (dados[campo] !== undefined && dados[campo] !== null && dados[campo] !== "") {
      dados[campo] = new ObjectId(dados[campo]);
    }
  }
  return dados;
}

export async function validarRelacionamentos(config, body) {
  for (const { campo, referencia } of relacionamentosDoRecurso(config)) {
    const valor = body?.[campo];
    if (valor === undefined || valor === null || valor === "") continue;
    if (!idValido(valor)) return `${campo} deve conter um ID MongoDB valido.`;

    const documento = await (
      await obterColecao(referencia)
    ).findOne({ _id: new ObjectId(valor) }, { projection: { _id: 1 } });
    if (!documento) return `${campo} referencia um registro inexistente em ${referencia}.`;
  }
  return null;
}

export function validarDados(body, camposObrigatorios) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "O corpo da requisicao deve ser um objeto JSON.";
  }

  const ausentes = camposObrigatorios.filter(
    (campo) => typeof body[campo] !== "string" || body[campo].trim() === "",
  );
  return ausentes.length ? `Campos obrigatorios ausentes: ${ausentes.join(", ")}.` : null;
}

export async function listarRecurso(config) {
  const documentos = await (
    await obterColecao(config.colecao)
  )
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return documentos.map((documento) => paraResposta(documento, config));
}

export async function buscarRecurso(config, id) {
  if (!idValido(id)) return null;
  const documento = await (await obterColecao(config.colecao)).findOne({ _id: new ObjectId(id) });
  return documento ? paraResposta(documento, config) : null;
}

export async function criarRecurso(config, body) {
  const agora = new Date();
  const resultado = await (
    await obterColecao(config.colecao)
  ).insertOne({
    ...limparDados(body, config),
    createdAt: agora,
    updatedAt: agora,
  });
  return buscarRecurso(config, String(resultado.insertedId));
}

export async function atualizarRecurso(config, id, body) {
  if (!idValido(id)) return null;
  const documento = await (
    await obterColecao(config.colecao)
  ).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...limparDados(body, config), updatedAt: new Date() } },
    { returnDocument: "after" },
  );
  return documento ? paraResposta(documento, config) : null;
}

export async function excluirRecurso(config, id) {
  if (!idValido(id)) return false;
  const resultado = await (
    await obterColecao(config.colecao)
  ).deleteOne({
    _id: new ObjectId(id),
  });
  return resultado.deletedCount === 1;
}
