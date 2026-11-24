"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAdmin, type LoginState } from "./actions";

export function AdminLoginForm({
  next,
  usesDevDefault,
}: {
  next: string;
  usesDevDefault: boolean;
}) {
  const initialState: LoginState = { message: "" };
  const [state, formAction, isPending] = useActionState(
    loginAdmin,
    initialState,
  );

  return (
    <form action={formAction} className="rounded-md border border-border bg-card p-6 md:p-8">
      <input type="hidden" name="next" value={next} />

      <h1 className="text-2xl">Entrar no admin</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Gerir produtos, imagens e o carrossel da página inicial.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium">Utilizador</label>
          <Input id="username" name="username" autoComplete="username" defaultValue="admin" className="mt-2" required />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">Palavra-passe</label>
          <Input id="password" name="password" type="password" autoComplete="current-password" className="mt-2" required />
        </div>
      </div>

      {state.message ? (
        <p role="alert" className="mt-5 rounded-sm border border-destructive/50 bg-destructive/10 p-3 text-sm">
          {state.message}
        </p>
      ) : null}

      {usesDevDefault ? (
        <p className="mt-5 rounded-sm border border-gold/40 bg-gold/10 p-3 text-meta">
          Ambiente local sem ADMIN_PASSWORD: usa admin / admin. Em produção, define uma palavra-passe forte.
        </p>
      ) : null}

      <Button type="submit" disabled={isPending} className="mt-6 w-full">
        {isPending ? "A entrar…" : "Entrar"}
      </Button>
    </form>
  );
}
