import ImageKit from "@imagekit/nodejs";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import {config} from "../config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../uploads");

const client = config.IMAGEKIT_PRIVATE_KEY
    ? new ImageKit({
        privateKey: config.IMAGEKIT_PRIVATE_KEY,
    })
    : null;

function safeFileName(fileName = "product-image") {
    const extension = path.extname(fileName) || ".jpg";
    return `${crypto.randomUUID()}${extension.toLowerCase()}`;
}

async function uploadToLocalStorage({ buffer, fileName }) {
    await fs.mkdir(uploadsDir, { recursive: true });
    const savedName = safeFileName(fileName);
    const savedPath = path.join(uploadsDir, savedName);
    await fs.writeFile(savedPath, buffer);

    return {
        url: `/uploads/${savedName}`,
        fileId: savedName,
        name: savedName,
        storage: "local",
    };
}

export async function uploadFile({ buffer, fileName, folder= "snitch-products"}){
    if (!client) {
        return uploadToLocalStorage({ buffer, fileName });
    }

    const  result = await client.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder
    })
    return result
}
