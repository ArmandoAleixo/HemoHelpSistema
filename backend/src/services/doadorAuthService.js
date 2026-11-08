import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { env } from "../config/env.js";
import { obterColecao } from "../database/mongodb.js";

const COLECAO = "DoadoresCCadastro";
const CUSTO_BCRYPT = 10;
const VALIDADE_TOKEN = "1d";
const CAMPOS_CADASTRO = ["nome", "email", "tipoSanguineo", "senha"];
const CAMPOS_LOGIN = ["email", "senha"];
const TAMANHO_MINIMO_SENHA = 6;
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_EM_USO = "E-mail já cadastrado. Deseja recuperar a senha?";
const CREDENCIAIS_INVALIDAS = "E-mail ou senha inválidos";

function normalizarEmail(email) {
  return String(email).trim().toLowerCase();
}

function camposAusentes(body, campos) {
  return campos.filter((campo) => typeof body?.[campo] !== "string" || body[campo].trim() === "");
}

function opcional(body, campo) {
  const valor = body?.[campo];
  return typeof valor === "string" && valor.trim() !== "" ? valor.trim() : undefined;
}

// Formato publico do doador: nunca inclui o senhaHash.
function paraDoadorPublico(documento) {
  return {
    id: String(documento._id),
    nome: documento.nome,
    email: documento.email,
    tipoSanguineo: documento.tipo ?? documento.tipoSanguineo,
    cpf: documento.cpf,
    telefone: documento.telefone,
    status: documento.status,
    createdAt: documento.createdAt,
    updatedAt: documento.updatedAt,
  };
}

function segredoJwt() {
  if (!env.jwtSecret) {
    throw new Error("JWT_SECRET não foi definida no arquivo .env");
  }
  return env.jwtSecret;
}

function gerarToken(documento) {
  return jwt.sign({ id: String(documento._id) }, segredoJwt(), { expiresIn: VALIDADE_TOKEN });
}

async function buscarPorEmail(email) {
  return (await obterColecao(COLECAO)).findOne({ email });
}

export async function cadastrar(body) {
  const ausentes = camposAusentes(body, CAMPOS_CADASTRO);
  if (ausentes.length) {
    return { status: 400, body: { erro: `Campos obrigatórios ausentes: ${ausentes.join(", ")}.` } };
  }

  if (body.senha.length < TAMANHO_MINIMO_SENHA) {
    return { status: 400, body: { erro: "A senha deve ter no mínimo 6 caracteres." } };
  }

  const email = normalizarEmail(body.email);
  if (!EMAIL_VALIDO.test(email)) {
    return { status: 400, body: { erro: "Informe um e-mail válido." } };
  }

  if (await buscarPorEmail(email)) {
    return { status: 409, body: { erro: EMAIL_EM_USO } };
  }

  const agora = new Date();
  const documento = {
    nome: body.nome.trim(),
    email,
    // O campo do cadastro atual do sistema se chama "tipo" no MongoDB.
    tipo: body.tipoSanguineo.trim(),
    senhaHash: await bcrypt.hash(body.senha, CUSTO_BCRYPT),
    status: "Em triagem",
    createdAt: agora,
    updatedAt: agora,
  };

  const cpf = opcional(body, "cpf");
  if (cpf) documento.cpf = cpf;
  const telefone = opcional(body, "telefone");
  if (telefone) documento.telefone = telefone;

  try {
    const resultado = await (await obterColecao(COLECAO)).insertOne(documento);
    return { status: 201, body: paraDoadorPublico({ _id: resultado.insertedId, ...documento }) };
  } catch (error) {
    // O indice unico do e-mail evita duas contas no mesmo instante.
    if (error.code === 11000) return { status: 409, body: { erro: EMAIL_EM_USO } };
    throw error;
  }
}

export async function login(body) {
  const ausentes = camposAusentes(body, CAMPOS_LOGIN);
  if (ausentes.length) {
    return { status: 400, body: { erro: `Campos obrigatórios ausentes: ${ausentes.join(", ")}.` } };
  }

  const documento = await buscarPorEmail(normalizarEmail(body.email));
  const senhaConfere =
    documento && documento.senhaHash
      ? await bcrypt.compare(body.senha, documento.senhaHash)
      : false;

  // A mesma mensagem vale para e-mail inexistente e senha errada.
  if (!documento || !senhaConfere) {
    return { status: 401, body: { erro: CREDENCIAIS_INVALIDAS } };
  }

  return {
    status: 200,
    body: { token: gerarToken(documento), doador: paraDoadorPublico(documento) },
  };
}

export async function buscarDoadorPorId(id) {
  if (!ObjectId.isValid(id)) return null;

  const documento = await (await obterColecao(COLECAO)).findOne({ _id: new ObjectId(id) });
  return documento ? paraDoadorPublico(documento) : null;
}
