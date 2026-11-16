import "dotenv/config";

const mongoUri = process.env.MONGODB_URI;

const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? process.env.Cloudinary_name,
  apiKey: process.env.CLOUDINARY_API_KEY ?? process.env.Cloudinary_key,
  apiSecret: process.env.CLOUDINARY_API_SECRET ?? process.env.Cloudinary_secret,
  folder: process.env.CLOUDINARY_FOLDER ?? "Campanhas",
};

if (!mongoUri) {
  throw new Error("MONGODB_URI nao foi definida no arquivo .env");
}

export const env = Object.freeze({
  mongoUri,
  mongoDatabase: process.env.MONGODB_DB ?? "hemohelp",
  port: Number(process.env.PORT ?? 3001),
  frontendOrigins: (
    process.env.FRONTEND_ORIGIN ??
    "http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:5175,http://127.0.0.1:3000"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  cloudinary: Object.freeze(cloudinary),
});
