import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { responder } from "../http/http.js";

function extrairToken(request) {
  const cabecalho = request.headers.authorization ?? "";
  const [esquema, token] = cabecalho.trim().split(/\s+/);
  if (!token || esquema.toLowerCase() !== "bearer") return null;
  return token;
}

// Valida o token e coloca o id do doador em request.doadorId.
// Devolve false quando a resposta 401 ja foi enviada.
export function autenticarDoador(request, response) {
  const token = extrairToken(request);
  if (!token) {
    responder(response, 401, { erro: "Token de autenticação ausente." });
    return false;
  }

  if (!env.jwtSecret) {
    throw new Error("JWT_SECRET não foi definida no arquivo .env");
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    if (typeof payload !== "object" || !payload.id) {
      throw new Error("Token sem o id do doador.");
    }
    request.doadorId = String(payload.id);
    return true;
  } catch {
    responder(response, 401, { erro: "Token inválido ou expirado." });
    return false;
  }
}
