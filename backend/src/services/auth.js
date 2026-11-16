import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { ObjectId } from "mongodb";
import { obterColecao } from "../database/mongodb.js";

const DURACAO_SESSAO = 7 * 24 * 60 * 60 * 1000;
const NOME_COOKIE = "hemohelp_session";

export function criarHashSenha(senha) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(senha, salt, 64).toString("hex")}`;
}

export function verificarSenha(senha, hash) {
  if (typeof hash !== "string") return false;
  const [salt, valor] = hash.split(":");
  if (!salt || !/^[a-f\d]{128}$/i.test(valor ?? "")) return false;
  const esperado = Buffer.from(valor, "hex");
  const calculado = scryptSync(senha, salt, esperado.length);
  return timingSafeEqual(esperado, calculado);
}

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function tokenDoRequest(request) {
  const cookie = request.headers.cookie?.split("; ").find((item) => item.startsWith(`${NOME_COOKIE}=`));
  return cookie?.slice(NOME_COOKIE.length + 1) ?? null;
}

export async function iniciarSessao(usuario, chaveAba) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + DURACAO_SESSAO);
  await (await obterColecao("SessoesUsuarios")).insertOne({
    tokenHash: hashToken(token),
    chaveAbaHash: hashToken(chaveAba),
    usuarioId: usuario._id,
    expiresAt,
  });
  return token;
}

export async function usuarioDaSessao(request) {
  const token = tokenDoRequest(request);
  const chaveAba = request.headers["x-session-tab"];
  if (!token || !/^[a-f\d]{64}$/i.test(token) || typeof chaveAba !== "string" || !/^[a-f\d]{64}$/i.test(chaveAba)) return null;
  const sessao = await (await obterColecao("SessoesUsuarios")).findOne({
    tokenHash: hashToken(token),
    chaveAbaHash: hashToken(chaveAba),
    expiresAt: { $gt: new Date() },
  });
  if (!sessao || !(sessao.usuarioId instanceof ObjectId)) return null;
  return (await obterColecao("Usuarios")).findOne(
    { _id: sessao.usuarioId },
    { projection: { nomeUsuario: 1 } },
  );
}

export async function encerrarSessao(request) {
  const token = tokenDoRequest(request);
  if (token && /^[a-f\d]{64}$/i.test(token)) {
    await (await obterColecao("SessoesUsuarios")).deleteOne({ tokenHash: hashToken(token) });
  }
}

export async function revogarSessoesUsuario(usuarioId) {
  await (await obterColecao("SessoesUsuarios")).deleteMany({ usuarioId: new ObjectId(usuarioId) });
}

export function cookieSessao(request, token) {
  const seguro = request.socket.encrypted || request.headers["x-forwarded-proto"] === "https";
  return `${NOME_COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax${seguro ? "; Secure" : ""}`;
}

export function cookieSessaoExpirada(request) {
  const seguro = request.socket.encrypted || request.headers["x-forwarded-proto"] === "https";
  return `${NOME_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${seguro ? "; Secure" : ""}`;
}
