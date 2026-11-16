import { env } from "../config/env.js";

const headers = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-headers": "Content-Type, X-Session-Tab",
  "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
};

export function origemPermitida(request) {
  const origin = request.headers.origin;
  if (!origin) return true;
  const host = request.headers.host;
  return env.frontendOrigins.includes(origin) || origin === `http://${host}` || origin === `https://${host}`;
}

export function responder(response, status, body, extras = {}) {
  const origin = response.req?.headers.origin;
  response.writeHead(status, {
    ...headers,
    ...(origin && origemPermitida(response.req)
      ? { "access-control-allow-origin": origin, "access-control-allow-credentials": "true", vary: "Origin" }
      : {}),
    ...extras,
  });
  response.end(body === null ? undefined : JSON.stringify(body));
}

export async function lerBody(request) {
  const partes = [];
  for await (const parte of request) partes.push(parte);
  if (!partes.length) return {};

  try {
    return JSON.parse(Buffer.concat(partes).toString("utf8"));
  } catch {
    throw new Error("O corpo da requisicao precisa ser um JSON valido.");
  }
}
