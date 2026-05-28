"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createAdminSession,
  getAdminAuthConfig,
  getSafeAdminNextPath,
} from "@/lib/admin-auth";

export type LoginState = {
  message: string;
};

export async function loginAdmin(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = getSafeAdminNextPath(formData.get("next"));
  const config = getAdminAuthConfig();

  if (!config.isAvailable) {
    return {
      message:
        "Defina ADMIN_PASSWORD no ambiente para activar o login do administrador.",
    };
  }

  if (username !== config.username || password !== config.password) {
    return { message: "Credenciais inválidas." };
  }

  const session = await createAdminSession(username);
  if (!session) {
    return { message: "Não foi possível criar a sessão." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, session, {
    httpOnly: true,
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect(next);
}
