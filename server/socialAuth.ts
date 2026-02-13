import type { Express, Request, Response } from "express";
import crypto from "crypto";
import { storage } from "./storage";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const APPLE_AUTH_URL = "https://appleid.apple.com/auth/authorize";
const APPLE_TOKEN_URL = "https://appleid.apple.com/auth/token";

function getBaseUrl(req: any): string {
  const domain = process.env.REPLIT_DOMAINS?.split(",")[0] || req.hostname;
  return `https://${domain}`;
}

export function setupSocialAuth(app: Express) {
  app.get("/api/auth/google", (req, res) => {
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

  app.get("/api/auth/google/callback", async (req, res) => {
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

  app.get("/api/auth/apple", (req, res) => {
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

  app.post("/api/auth/apple/callback", async (req, res) => {
    try {
      const { code, state, id_token, user: appleUser } = req.body;
      const savedState = (req.session as any).oauthState;

      if (!code || !state || state !== savedState) {
        return res.redirect("/auth?error=invalid_state");
      }

      delete (req.session as any).oauthState;

      const clientId = process.env.APPLE_CLIENT_ID;
      const clientSecret = process.env.APPLE_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
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

      let email = "";
      let firstName = "";
      let lastName = "";

      if (tokenData.id_token) {
        const payload = JSON.parse(
          Buffer.from(tokenData.id_token.split(".")[1], "base64").toString()
        );
        email = payload.email || "";
      }

      if (appleUser) {
        try {
          const parsedUser = typeof appleUser === "string" ? JSON.parse(appleUser) : appleUser;
          firstName = parsedUser?.name?.firstName || "";
          lastName = parsedUser?.name?.lastName || "";
          if (parsedUser?.email) email = parsedUser.email;
        } catch {}
      }

      if (!email) {
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

  app.get("/api/auth/social/status", (_req, res) => {
    res.json({
      google: !!process.env.GOOGLE_CLIENT_ID,
      apple: !!process.env.APPLE_CLIENT_ID,
    });
  });
}
