import { ObjectId } from "mongodb";
import { obterColecao } from "./BancoDeDados.js";

export function idValido(id) {
  return ObjectId.isValid(id);
}

function paraResposta(documento) {
  const { _id, ...dados } = documento;
  return { id: String(_id), ...dados };
}

function limparDados(body) {
  const dados = { ...body };
  delete dados._id;
  delete dados.id;
  delete dados.createdAt;
  delete dados.updatedAt;
  return dados;
}

export function validarDados(body, camposObrigatorios) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "O corpo da requisicao deve ser um objeto JSON.";
  }

  const ausentes = camposObrigatorios.filter(
    (campo) => typeof body[campo] !== "string" || body[campo].trim() === "",
  );

  return ausentes.length > 0 ? `Campos obrigatorios ausentes: ${ausentes.join(", ")}.` : null;
}

export async function listarRecurso(config) {
  const documentos = await (
    await obterColecao(config.colecao)
  )
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return documentos.map(paraResposta);
}

export async function buscarRecurso(config, id) {
  if (!idValido(id)) return null;
  const documento = await (await obterColecao(config.colecao)).findOne({ _id: new ObjectId(id) });
  return documento ? paraResposta(documento) : null;
}

export async function criarRecurso(config, body) {
  const dados = limparDados(body);
  const agora = new Date();
  const resultado = await (
    await obterColecao(config.colecao)
  ).insertOne({ ...dados, createdAt: agora, updatedAt: agora });
  return buscarRecurso(config, String(resultado.insertedId));
}

export async function atualizarRecurso(config, id, body) {
  if (!idValido(id)) return null;
  const dados = limparDados(body);
  const resultado = await (
    await obterColecao(config.colecao)
  ).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...dados, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
  return resultado ? paraResposta(resultado) : null;
}

export async function excluirRecurso(config, id) {
  if (!idValido(id)) return false;
  const resultado = await (await obterColecao(config.colecao)).deleteOne({ _id: new ObjectId(id) });
  return resultado.deletedCount === 1;
}
