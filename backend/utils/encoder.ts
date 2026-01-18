import crypto from "crypto";

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE = ALPHABET.length;

function bufferToBase62(buffer: Buffer): string {
    let num = BigInt("0x" + buffer.toString("hex"));
    let encoded = "";

    while (num > 0n) {
        encoded = ALPHABET[Number(num % BigInt(BASE))] + encoded;
        num = num / BigInt(BASE);
    }

    return encoded;
}

export function generateShortKey(url: string): string {
    const timestamp = Date.now().toString();
    const salt = crypto.randomBytes(4).toString("hex");

    const hashInput = `${url}:${timestamp}:${salt}`;

    const hash = crypto
        .createHash("sha256")
        .update(hashInput)
        .digest();

    const base62 = bufferToBase62(hash).slice(0, 8);

    return `${base62.slice(0, 4)}-${base62.slice(4, 8)}`;
}
