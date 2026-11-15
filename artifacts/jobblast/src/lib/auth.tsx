import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { setAuthTokenGetter } from "@workspace/api-client-react";

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isGoogleConfigured: boolean;
  signOut: () => void;
  signInAsGuest: () => void;
  renderGoogleButton: (element: HTMLElement | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  isGoogleConfigured: false,
  signOut: () => {},
  signInAsGuest: () => {},
  renderGoogleButton: () => {},
});

const STORAGE_KEY_USER = "jobblast_user";
const STORAGE_KEY_TOKEN = "jobblast_token";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

function parseJwt(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_TOKEN);
  });

  const [isLoading, setIsLoading] = useState(true);

  // Synchronize with API client
  useEffect(() => {
    setAuthTokenGetter(() => token);
  }, [token]);

  const handleCredentialResponse = useCallback((response: any) => {
    const idToken = response.credential;
    if (!idToken) return;

    const payload = parseJwt(idToken);
    if (!payload) return;

    const newUser: User = {
      id: payload.sub,
      email: payload.email || "",
      name: payload.name || payload.email || "Google User",
      picture: payload.picture || "",
    };

    setUser(newUser);
    setToken(idToken);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEY_TOKEN, idToken);
  }, []);

  // Initialize Google Identity Services
  useEffect(() => {
    const isConfigured = Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== "your_google_client_id_here");
    
    if (isConfigured && typeof window !== "undefined") {
      const initGsi = () => {
        if ((window as any).google?.accounts?.id) {
          (window as any).google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
          });
        }
      };

      if ((window as any).google?.accounts?.id) {
        initGsi();
      } else {
        const interval = setInterval(() => {
          if ((window as any).google?.accounts?.id) {
            initGsi();
            clearInterval(interval);
          }
        }, 100);
        return () => clearInterval(interval);
      }
    }
    setIsLoading(false);
  }, [handleCredentialResponse]);

  const renderGoogleButton = useCallback((element: HTMLElement | null) => {
    if (!element || !(window as any).google?.accounts?.id) return;
    try {
      (window as any).google.accounts.id.renderButton(element, {
        theme: "outline",
        size: "large",
        shape: "rectangular",
        width: 250,
        text: "continue_with",
      });
    } catch (e) {
      console.warn("Error rendering Google button:", e);
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    setAuthTokenGetter(null);
    if ((window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.disableAutoSelect();
    }
  }, []);

  const signInAsGuest = useCallback(() => {
    const guestUser: User = {
      id: "guest_user",
      email: "guest@infrashift.app",
      name: "Guest Explorer",
      picture: "",
    };
    setUser(guestUser);
    setToken("guest_token");
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(guestUser));
    localStorage.setItem(STORAGE_KEY_TOKEN, "guest_token");
  }, []);

  const isGoogleConfigured = Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== "your_google_client_id_here");

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isGoogleConfigured,
        signOut,
        signInAsGuest,
        renderGoogleButton,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
