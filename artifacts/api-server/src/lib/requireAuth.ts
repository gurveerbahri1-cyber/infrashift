import type { Request, Response, NextFunction } from "express";

export const DEFAULT_USER_ID = "default_user";

function parseJwt(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    if (token && token !== "guest_token") {
      const payload = parseJwt(token);
      if (payload && payload.sub) {
        // Authenticated Google OAuth user
        (req as Request & { userId: string; userEmail?: string }).userId = `google_${payload.sub}`;
        (req as Request & { userId: string; userEmail?: string }).userEmail = payload.email;
        next();
        return;
      }
    }
  }

  // Fallback to default user for guest / demo mode
  (req as Request & { userId: string }).userId = DEFAULT_USER_ID;
  next();
}
