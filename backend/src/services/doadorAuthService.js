import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { env } from "../config/env.js";
import { obterColecao } from "../database/mongodb.js";

const COLECAO = "DoadoresCCadastro";
const CUSTO_BCRYPT = 10;
const VALIDADE_TOKEN = "1d";
const CAMPOS_CADASTRO = ["nome", "email", "tipoSanguineo", "senha", "cpf"];
const CAMPOS_LOGIN = ["email", "senha"];
const CAMPOS_SENHA = ["senhaAtual", "novaSenha"];
const TAMANHO_MINIMO_SENHA = 6;
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_EM_USO = "E-mail já cadastrado. Deseja recuperar a senha?";
const CREDENCIAIS_INVALIDAS = "E-mail ou senha inválidos";
const CPF_INVALIDO = "CPF inválido.";
const CPF_EM_USO = "CPF já cadastrado.";
const TELEFONE_INVALIDO = "Telefone inválido. Informe 10 ou 11 dígitos.";
const DOADOR_NAO_ENCONTRADO = "Doador não encontrado.";

function normalizarEmail(email) {
  return String(email).trim().toLowerCase();
}

function apenasDigitos(valor) {
  return String(valor ?? "").replace(/\D/g, "");
}

function camposAusentes(body, campos) {
  return campos.filter((campo) => typeof body?.[campo] !== "string" || body[campo].trim() === "");
}

function opcional(body, campo) {
  const valor = body?.[campo];
  return typeof valor === "string" && valor.trim() !== "" ? valor.trim() : undefined;
}

// Fase de testes: só confere se tem 11 números.
// TODO: validação completa de CPF após aprovação do projeto.
function cpfValido(valor) {
  return apenasDigitos(valor).length === 11;
}

// Telefone aceita fixo (10 digitos) ou celular (11 digitos).
function telefoneValido(valor) {
  const digitos = apenasDigitos(valor);
  return digitos.length === 10 || digitos.length === 11;
}

// Formato publico do doador: nunca inclui o senhaHash.
function paraDoadorPublico(documento) {
  return {
    id: String(documento._id),
    nome: documento.nome,
    email: documento.email,
    tipoSanguineo: documento.tipo ?? documento.tipoSanguineo,
    tipoSanguineoVerificado: documento.tipoSanguineoVerificado === true,
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

  if (!cpfValido(body.cpf)) {
    return { status: 400, body: { erro: CPF_INVALIDO } };
  }
  // Guarda apenas os numeros, sem a mascara.
  const cpf = apenasDigitos(body.cpf);

  // O telefone e opcional, mas quando enviado precisa ter 10 ou 11 digitos.
  const telefoneBruto = opcional(body, "telefone");
  if (telefoneBruto !== undefined && !telefoneValido(telefoneBruto)) {
    return { status: 400, body: { erro: TELEFONE_INVALIDO } };
  }
  const telefone = telefoneBruto === undefined ? undefined : apenasDigitos(telefoneBruto);

  const colecao = await obterColecao(COLECAO);
  if (await colecao.findOne({ cpf })) {
    return { status: 409, body: { erro: CPF_EM_USO } };
  }

  if (await buscarPorEmail(email)) {
    return { status: 409, body: { erro: EMAIL_EM_USO } };
  }

  const agora = new Date();
  const documento = {
    nome: body.nome.trim(),
    email,
    cpf,
    // O campo do cadastro atual do sistema se chama "tipo" no MongoDB.
    tipo: body.tipoSanguineo.trim(),
    senhaHash: await bcrypt.hash(body.senha, CUSTO_BCRYPT),
    status: "Em triagem",
    // O tipo sanguineo so e confirmado pelo hemocentro na primeira doacao.
    tipoSanguineoVerificado: false,
    createdAt: agora,
    updatedAt: agora,
  };

  if (telefone) documento.telefone = telefone;

  try {
    const resultado = await colecao.insertOne(documento);
    return { status: 201, body: paraDoadorPublico({ _id: resultado.insertedId, ...documento }) };
  } catch (error) {
    // Os indices unicos evitam duas contas com o mesmo e-mail ou CPF no mesmo instante.
    if (error.code === 11000) {
      if (error.keyPattern?.cpf) return { status: 409, body: { erro: CPF_EM_USO } };
      return { status: 409, body: { erro: EMAIL_EM_USO } };
    }
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

// Atualiza somente nome, email e telefone. Qualquer outro campo enviado e ignorado.
export async function atualizarPerfil(id, body) {
  if (!ObjectId.isValid(id)) {
    return { status: 404, body: { erro: DOADOR_NAO_ENCONTRADO } };
  }

  const colecao = await obterColecao(COLECAO);
  const documento = await colecao.findOne({ _id: new ObjectId(id) });
  if (!documento) {
    return { status: 404, body: { erro: DOADOR_NAO_ENCONTRADO } };
  }

  const alteracoes = {};
  let removerTelefone = false;

  if (body?.nome !== undefined) {
    if (typeof body.nome !== "string" || body.nome.trim() === "") {
      return { status: 400, body: { erro: "Informe seu nome." } };
    }
    alteracoes.nome = body.nome.trim();
  }

  if (body?.email !== undefined) {
    const email = normalizarEmail(body.email);
    if (!EMAIL_VALIDO.test(email)) {
      return { status: 400, body: { erro: "Informe um e-mail válido." } };
    }

    const emailEmUso = await colecao.findOne({ email, _id: { $ne: documento._id } });
    if (emailEmUso) return { status: 409, body: { erro: EMAIL_EM_USO } };

    alteracoes.email = email;
  }

  if (body?.telefone !== undefined) {
    const vazio =
      body.telefone === null || (typeof body.telefone === "string" && body.telefone.trim() === "");

    if (vazio) {
      // Telefone em branco remove o campo.
      removerTelefone = true;
    } else if (typeof body.telefone !== "string" || !telefoneValido(body.telefone)) {
      return { status: 400, body: { erro: TELEFONE_INVALIDO } };
    } else {
      alteracoes.telefone = apenasDigitos(body.telefone);
    }
  }

  if (Object.keys(alteracoes).length === 0 && !removerTelefone) {
    return {
      status: 400,
      body: { erro: "Envie ao menos um campo: nome, email ou telefone." },
    };
  }

  alteracoes.updatedAt = new Date();

  const atualizacao = { $set: alteracoes };
  if (removerTelefone) atualizacao.$unset = { telefone: "" };

  try {
    const atualizado = await colecao.findOneAndUpdate({ _id: documento._id }, atualizacao, {
      returnDocument: "after",
    });
    if (!atualizado) return { status: 404, body: { erro: DOADOR_NAO_ENCONTRADO } };
    return { status: 200, body: paraDoadorPublico(atualizado) };
  } catch (error) {
    if (error.code === 11000) return { status: 409, body: { erro: EMAIL_EM_USO } };
    throw error;
  }
}

// Troca a senha exigindo a senha atual, para proteger a conta de quem pegou o token.
export async function alterarSenha(id, body) {
  const ausentes = camposAusentes(body, CAMPOS_SENHA);
  if (ausentes.length) {
    return { status: 400, body: { erro: `Campos obrigatórios ausentes: ${ausentes.join(", ")}.` } };
  }

  if (body.novaSenha.length < TAMANHO_MINIMO_SENHA) {
    return { status: 400, body: { erro: "A senha deve ter no mínimo 6 caracteres." } };
  }

  if (!ObjectId.isValid(id)) {
    return { status: 404, body: { erro: DOADOR_NAO_ENCONTRADO } };
  }

  const colecao = await obterColecao(COLECAO);
  const documento = await colecao.findOne({ _id: new ObjectId(id) });
  if (!documento) {
    return { status: 404, body: { erro: DOADOR_NAO_ENCONTRADO } };
  }

  const senhaConfere = documento.senhaHash
    ? await bcrypt.compare(body.senhaAtual, documento.senhaHash)
    : false;

  if (!senhaConfere) {
    return { status: 401, body: { erro: "Senha atual incorreta." } };
  }

  await colecao.updateOne(
    { _id: documento._id },
    {
      $set: {
        senhaHash: await bcrypt.hash(body.novaSenha, CUSTO_BCRYPT),
        updatedAt: new Date(),
      },
    },
  );

  return { status: 200, body: { mensagem: "Senha alterada com sucesso." } };
}
