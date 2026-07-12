import crypto from "crypto";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const STEP_SECONDS = 30;
const CODE_DIGITS = 6;

function base32Encode(buffer: Buffer) {
  let bits = "";
  let output = "";

  for (const byte of buffer) {
    bits += byte.toString(2).padStart(8, "0");
  }

  for (let index = 0; index < bits.length; index += 5) {
    const chunk = bits.slice(index, index + 5).padEnd(5, "0");
    output += ALPHABET[parseInt(chunk, 2)];
  }

  return output;
}

function base32Decode(value: string) {
  const cleanValue = value.replace(/=+$/g, "").replace(/\s+/g, "").toUpperCase();
  let bits = "";

  for (const char of cleanValue) {
    const index = ALPHABET.indexOf(char);
    if (index === -1) throw new Error("Invalid base32 secret.");
    bits += index.toString(2).padStart(5, "0");
  }

  const bytes: number[] = [];
  for (let index = 0; index + 8 <= bits.length; index += 8) {
    bytes.push(parseInt(bits.slice(index, index + 8), 2));
  }

  return Buffer.from(bytes);
}

function hotp(secret: string, counter: number) {
  const key = base32Decode(secret);
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(counter), 0);

  const hmac = crypto.createHmac("sha1", key).update(buffer).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  return String(binary % 10 ** CODE_DIGITS).padStart(CODE_DIGITS, "0");
}

export function createTotpSecret() {
  return base32Encode(crypto.randomBytes(20));
}

export function createOtpAuthUrl(secret: string, email: string) {
  const issuer = "Digitrust Solutions";
  const label = `${issuer}:${email}`;
  const params = new URLSearchParams({
    secret,
    issuer,
    algorithm: "SHA1",
    digits: String(CODE_DIGITS),
    period: String(STEP_SECONDS),
  });

  return `otpauth://totp/${encodeURIComponent(label)}?${params.toString()}`;
}

export function verifyTotpCode(secret: string, code: string) {
  const cleanCode = code.replace(/\s+/g, "");
  if (!/^\d{6}$/.test(cleanCode)) return false;

  const currentCounter = Math.floor(Date.now() / 1000 / STEP_SECONDS);
  for (let offset = -1; offset <= 1; offset += 1) {
    if (hotp(secret, currentCounter + offset) === cleanCode) return true;
  }

  return false;
}
