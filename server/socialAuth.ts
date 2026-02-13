import type { Express, Request, Response } from "express";
import crypto from "crypto";
import { storage } from "./storage";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";
const GOOGLE_CERTS_URL = "https://www.googleapis.com/oauth2/v3/certs";

const APPLE_AUTH_URL = "https://appleid.apple.com/auth/authorize";
const APPLE_TOKEN_URL = "https://appleid.apple.com/auth/token";
const APPLE_KEYS_URL = "https://appleid.apple.com/auth/keys";

async function generateAppleClientSecret(): Promise<string | null> {
  const teamId = process.env.APPLE_TEAM_ID;
  const keyId = process.env.APPLE_KEY_ID;
  const clientId = process.env.APPLE_CLIENT_ID;
  const privateKey = process.env.APPLE_PRIVATE_KEY;

  if (!teamId || !keyId || !clientId || !privateKey) {
    if (process.env.APPLE_CLIENT_SECRET) {
      return process.env.APPLE_CLIENT_SECRET;
    }
    return null;
  }

  try {
    const header = {
      alg: "ES256",
      kid: keyId,
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: teamId,
      iat: now,
      exp: now + 15777000,
      aud: "https://appleid.apple.com",
      sub: clientId,
    };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signingInput = `${encodedHeader}.${encodedPayload}`;

    const cleanKey = privateKey.replace(/\\n/g, "\n");
    const key = await crypto.subtle.importKey(
      "pkcs8",
      pemToBuffer(cleanKey),
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign(
      { name: "ECDSA", hash: "SHA-256" },
      key,
      Buffer.from(signingInput)
    );

    const sigBytes = new Uint8Array(signature);
    const encodedSignature = Buffer.from(sigBytes).toString("base64url");

    return `${signingInput}.${encodedSignature}`;
  } catch (error) {
    console.error("[APPLE AUTH] Failed to generate client secret:", error);
    return null;
  }
}

function pemToBuffer(pem: string): ArrayBuffer {
  const lines = pem.split("\n").filter(line =>
    !line.startsWith("-----") && line.trim().length > 0
  );
  const base64 = lines.join("");
  const binary = Buffer.from(base64, "base64");
  return binary.buffer.slice(binary.byteOffset, binary.byteOffset + binary.byteLength);
}

function getBaseUrl(req: Request): string {
  const domain = process.env.REPLIT_DOMAINS?.split(",")[0] || req.hostname;
  return `https://${domain}`;
}

function base64UrlDecode(str: string): Buffer {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return Buffer.from(str, "base64");
}

async function verifyAppleIdToken(idToken: string, expectedClientId: string): Promise<{ email: string; sub: string } | null> {
  try {
    const parts = idToken.split(".");
    if (parts.length !== 3) return null;

    const header = JSON.parse(base64UrlDecode(parts[0]).toString());
    const payload = JSON.parse(base64UrlDecode(parts[1]).toString());

    if (payload.iss !== "https://appleid.apple.com") {
      console.error("[APPLE AUTH] Invalid issuer:", payload.iss);
      return null;
    }

    if (payload.aud !== expectedClientId) {
      console.error("[APPLE AUTH] Invalid audience:", payload.aud);
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.error("[APPLE AUTH] Token expired");
      return null;
    }

    const keysRes = await fetch(APPLE_KEYS_URL);
    if (!keysRes.ok) {
      console.error("[APPLE AUTH] Failed to fetch Apple public keys");
      return null;
    }

    const { keys } = await keysRes.json();
    const matchingKey = keys.find((k: any) => k.kid === header.kid && k.alg === header.alg);
    if (!matchingKey) {
      console.error("[APPLE AUTH] No matching key found for kid:", header.kid);
      return null;
    }

    const publicKey = await crypto.subtle.importKey(
      "jwk",
      matchingKey,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const signatureValid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      publicKey,
      base64UrlDecode(parts[2]),
      Buffer.from(`${parts[0]}.${parts[1]}`)
    );

    if (!signatureValid) {
      console.error("[APPLE AUTH] Signature verification failed");
      return null;
    }

    return { email: payload.email || "", sub: payload.sub || "" };
  } catch (error) {
    console.error("[APPLE AUTH] Token verification error:", error);
    return null;
  }
}

export function setupSocialAuth(app: Express) {
  app.get("/api/auth/google", (req: Request, res: Response) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({ error: "Google Sign-In is not configured yet" });
    }

    const state = crypto.randomBytes(16).toString("hex");
    (req.session as any).oauthState = state;

    const redirectUri = `${getBaseUrl(req)}/api/auth/google/callback`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      state,
      access_type: "offline",
      prompt: "consent",
    });

    res.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
  });

  app.get("/api/auth/google/callback", async (req: Request, res: Response) => {
    try {
      const { code, state } = req.query;
      const savedState = (req.session as any).oauthState;

      if (!code || !state || state !== savedState) {
        return res.redirect("/auth?error=invalid_state");
      }

      delete (req.session as any).oauthState;

      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        return res.redirect("/auth?error=not_configured");
      }

      const redirectUri = `${getBaseUrl(req)}/api/auth/google/callback`;
      const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code: code as string,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      if (!tokenRes.ok) {
        console.error("[GOOGLE AUTH] Token exchange failed:", await tokenRes.text());
        return res.redirect("/auth?error=token_failed");
      }

      const tokenData = await tokenRes.json();

      const userInfoRes = await fetch(GOOGLE_USERINFO_URL, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      if (!userInfoRes.ok) {
        console.error("[GOOGLE AUTH] User info fetch failed");
        return res.redirect("/auth?error=userinfo_failed");
      }

      const profile = await userInfoRes.json();
      const email = profile.email;

      if (!email || !profile.email_verified) {
        console.error("[GOOGLE AUTH] No verified email in profile");
        return res.redirect("/auth?error=no_email");
      }

      const firstName = profile.given_name || profile.name?.split(" ")[0] || "";
      const lastName = profile.family_name || "";
      const profileImageUrl = profile.picture || null;

      let user = await storage.getUserByEmail(email);
      if (!user) {
        const userId = crypto.randomUUID();
        user = await storage.upsertUser({
          id: userId,
          email,
          firstName,
          lastName: lastName || null,
          profileImageUrl,
          authProvider: "google",
        });
      }

      (req.session as any).mobileUserId = user.id;
      res.redirect("/");
    } catch (error) {
      console.error("[GOOGLE AUTH] Callback error:", error);
      res.redirect("/auth?error=google_failed");
    }
  });

  app.get("/api/auth/apple", (req: Request, res: Response) => {
    const clientId = process.env.APPLE_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({ error: "Apple Sign-In is not configured yet" });
    }

    const state = crypto.randomBytes(16).toString("hex");
    (req.session as any).oauthState = state;

    const redirectUri = `${getBaseUrl(req)}/api/auth/apple/callback`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code id_token",
      scope: "name email",
      state,
      response_mode: "form_post",
    });

    res.redirect(`${APPLE_AUTH_URL}?${params.toString()}`);
  });

  app.post("/api/auth/apple/callback", async (req: Request, res: Response) => {
    try {
      const { code, state, id_token, user: appleUser } = req.body;
      const savedState = (req.session as any).oauthState;

      if (!code || !state || state !== savedState) {
        return res.redirect("/auth?error=invalid_state");
      }

      delete (req.session as any).oauthState;

      const clientId = process.env.APPLE_CLIENT_ID;
      const clientSecret = await generateAppleClientSecret();
      if (!clientId || !clientSecret) {
        console.error("[APPLE AUTH] Client ID or secret not available");
        return res.redirect("/auth?error=not_configured");
      }

      const redirectUri = `${getBaseUrl(req)}/api/auth/apple/callback`;
      const tokenRes = await fetch(APPLE_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code: code as string,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      if (!tokenRes.ok) {
        console.error("[APPLE AUTH] Token exchange failed:", await tokenRes.text());
        return res.redirect("/auth?error=token_failed");
      }

      const tokenData = await tokenRes.json();

      if (!tokenData.id_token) {
        console.error("[APPLE AUTH] No ID token in response");
        return res.redirect("/auth?error=token_failed");
      }

      const verified = await verifyAppleIdToken(tokenData.id_token, clientId);
      if (!verified) {
        console.error("[APPLE AUTH] ID token verification failed");
        return res.redirect("/auth?error=token_failed");
      }

      let email = verified.email;
      let firstName = "";
      let lastName = "";

      if (appleUser) {
        try {
          const parsedUser = typeof appleUser === "string" ? JSON.parse(appleUser) : appleUser;
          firstName = parsedUser?.name?.firstName || "";
          lastName = parsedUser?.name?.lastName || "";
          if (parsedUser?.email) email = parsedUser.email;
        } catch (e) {
          console.error("[APPLE AUTH] Failed to parse user data:", e);
        }
      }

      if (!email) {
        console.error("[APPLE AUTH] No email after verification");
        return res.redirect("/auth?error=no_email");
      }

      let user = await storage.getUserByEmail(email);
      if (!user) {
        const userId = crypto.randomUUID();
        user = await storage.upsertUser({
          id: userId,
          email,
          firstName: firstName || null,
          lastName: lastName || null,
          authProvider: "apple",
        });
      }

      (req.session as any).mobileUserId = user.id;
      res.redirect("/");
    } catch (error) {
      console.error("[APPLE AUTH] Callback error:", error);
      res.redirect("/auth?error=apple_failed");
    }
  });

  app.get("/api/auth/social/status", (_req: Request, res: Response) => {
    const appleConfigured = !!process.env.APPLE_CLIENT_ID && (
      !!process.env.APPLE_CLIENT_SECRET ||
      (!!process.env.APPLE_TEAM_ID && !!process.env.APPLE_KEY_ID && !!process.env.APPLE_PRIVATE_KEY)
    );
    res.json({
      google: !!process.env.GOOGLE_CLIENT_ID,
      apple: appleConfigured,
    });
  });
}
