const encoder = new TextEncoder();
const ITERATIONS = 100_000;
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const fromHex = (hex: string) => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
};

const deriveKey = async (password: string, salt: Uint8Array) => {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations: ITERATIONS,
    },
    key,
    KEY_LENGTH * 8
  );
  return new Uint8Array(bits);
};

export const hashPassword = async (password: string) => {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const derived = await deriveKey(password, salt);
  return `pbkdf2$${ITERATIONS}$${toHex(salt)}$${toHex(derived)}`;
};

export const verifyPassword = async (password: string, storedHash: string) => {
  const [scheme, iterationValue, saltHex, hashHex] = storedHash.split("$");
  if (scheme !== "pbkdf2" || !iterationValue || !saltHex || !hashHex) {
    return false;
  }

  const salt = fromHex(saltHex);
  const expected = fromHex(hashHex);
  const derived = await deriveKey(password, salt);

  let diff = expected.length ^ derived.length;
  for (let i = 0; i < expected.length; i += 1) {
    diff |= expected[i] ^ derived[i];
  }
  return diff === 0;
};
