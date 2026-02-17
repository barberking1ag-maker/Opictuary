import crypto from "crypto";

const MOBILE_TOKEN_SECRET: string = process.env.SESSION_SECRET || process.env.REPL_ID || '';
if (!MOBILE_TOKEN_SECRET) {
  console.error('[MOBILE TOKEN] WARNING: No SESSION_SECRET or REPL_ID set. Mobile auth tokens will not work.');
}

export function generateMobileAuthToken(userId: string): string {
  if (!MOBILE_TOKEN_SECRET) throw new Error('Mobile token secret not configured');
  const payload = JSON.stringify({ userId, iat: Date.now() });
  const signature = crypto.createHmac('sha256', MOBILE_TOKEN_SECRET).update(payload).digest('hex');
  return Buffer.from(payload).toString('base64url') + '.' + signature;
}

export function verifyMobileAuthToken(token: string): string | null {
  try {
    const [payloadB64, signature] = token.split('.');
    if (!payloadB64 || !signature) return null;
    const payload = Buffer.from(payloadB64, 'base64url').toString();
    const expectedSig = crypto.createHmac('sha256', MOBILE_TOKEN_SECRET).update(payload).digest('hex');
    if (signature !== expectedSig) return null;
    const data = JSON.parse(payload);
    const tokenAge = Date.now() - data.iat;
    if (tokenAge > 30 * 24 * 60 * 60 * 1000) return null;
    return data.userId;
  } catch {
    return null;
  }
}
