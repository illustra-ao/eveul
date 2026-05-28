"use client";

import { useActionState } from "react";
import { LockKeyhole, LogIn } from "lucide-react";
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
    <form
      action={formAction}
      className="rounded-4xl border border-border bg-card/15 p-6 backdrop-blur md:p-8"
    >
      <input type="hidden" name="next" value={next} />

      <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-black/25">
        <LockKeyhole className="h-4 w-4 text-[color:var(--gold)]" />
      </div>

      <div className="mt-5 text-xs tracking-[0.22em] text-[color:var(--gold)]">
        ADMIN
      </div>
      <h1 className="mt-3 font-[var(--font-display)] text-4xl leading-[1.05] tracking-tight">
        Acesso reservado.
      </h1>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        Entre com as credenciais do administrador para gerir produtos, imagens e
        publicação da colecção.
      </p>

      <div className="mt-7 grid gap-4">
        <label className="block">
          <span className="text-[11px] tracking-[0.22em] text-muted-foreground">
            UTILIZADOR
          </span>
          <Input
            name="username"
            autoComplete="username"
            defaultValue="admin"
            className="mt-2 h-11 rounded-2xl bg-black/20"
            required
          />
        </label>

        <label className="block">
          <span className="text-[11px] tracking-[0.22em] text-muted-foreground">
            PALAVRA-PASSE
          </span>
          <Input
            name="password"
            type="password"
            autoComplete="current-password"
            className="mt-2 h-11 rounded-2xl bg-black/20"
            required
          />
        </label>
      </div>

      {state.message ? (
        <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-100">
          {state.message}
        </div>
      ) : null}

      {usesDevDefault ? (
        <div className="mt-5 rounded-2xl border border-[color:var(--gold)]/25 bg-[color:var(--gold)]/10 p-4 text-xs leading-6 text-muted-foreground">
          Ambiente local sem ADMIN_PASSWORD: use admin / admin. Em produção,
          defina uma palavra-passe forte.
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={isPending}
        className="mt-6 h-11 w-full rounded-full bg-primary px-6 text-primary-foreground hover:opacity-90 disabled:opacity-60"
      >
        <LogIn className="mr-2 h-4 w-4" />
        {isPending ? "A entrar..." : "Entrar no admin"}
      </Button>
    </form>
  );
}
