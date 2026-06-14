import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Better Auth catch-all handler for /api/auth/*
// Handles: signIn, signUp, signOut, session, callback, etc.
export const { GET, POST } = toNextJsHandler(auth.handler);
