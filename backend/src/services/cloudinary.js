import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";

const TIPOS_PERMITIDOS = new Set(["image/jpeg", "image/png", "image/webp"]);
const TAMANHO_MAXIMO_BYTES = 5 * 1024 * 1024;

function configurarCloudinary() {
  const { cloudName, apiKey, apiSecret } = env.cloudinary;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary nao configurado. Defina CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET no .env.",
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export async function enviarImagemCampanha(dataUri) {
  if (typeof dataUri !== "string") throw new Error("Envie uma imagem valida.");

  const correspondencia = dataUri.match(
    /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/,
  );
  if (!correspondencia || !TIPOS_PERMITIDOS.has(correspondencia[1])) {
    throw new Error("Formato de imagem invalido. Use JPG, PNG ou WebP.");
  }

  const tamanhoAproximado = Math.floor((correspondencia[2].length * 3) / 4);
  if (tamanhoAproximado > TAMANHO_MAXIMO_BYTES) {
    throw new Error("A imagem deve ter no maximo 5 MB.");
  }

  configurarCloudinary();
  const resultado = await cloudinary.uploader.upload(dataUri, {
    asset_folder: env.cloudinary.folder,
    folder: env.cloudinary.folder,
    resource_type: "image",
    use_filename: true,
    unique_filename: true,
  });

  return { imagemUrl: resultado.secure_url, imagemPublicId: resultado.public_id };
}

export async function excluirImagemCampanha(publicId) {
  if (typeof publicId !== "string" || !publicId.trim()) return;

  configurarCloudinary();
  const resultado = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  if (resultado.result !== "ok" && resultado.result !== "not found") {
    throw new Error("Nao foi possivel excluir a imagem da campanha no Cloudinary.");
  }
}

export async function verificarCloudinary() {
  configurarCloudinary();
  return cloudinary.api.ping();
}
