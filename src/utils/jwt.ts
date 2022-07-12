const jwt = require("jsonwebtoken");

export function createJWT(
  payload: object,
  key: string,
  expiresIn: number | string
) {
  return jwt.sign(payload, key, { expiresIn });
}

export async function verifyJWT(token: string, key: string) {
  try {
    const decoded = jwt.verify(token, key);

    return decoded;
  } catch (error) {
    return null;
  }
}
