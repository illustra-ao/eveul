import * as React from "react";
import { cn } from "@/lib/utils";

/** Logótipo do WhatsApp (o lucide-react não inclui marcas). */
export function WhatsAppIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={cn("size-[1.125rem]", className)} {...props}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.2-.2-.2-.4-.3Z" />
    </svg>
  );
}

/**
 * Símbolo Eveul (triplo triângulo invertido).
 * PROVISÓRIO: substituir pelo SVG oficial quando o cliente o enviar.
 */
export function EveulMark({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 104" fill="none" stroke="currentColor" strokeWidth={5} aria-hidden="true" className={className} {...props}>
      <path d="M4 4h112L60 100z" />
      <path d="M20 14h80L60 82z" />
      <path d="M36 24h48L60 64z" />
    </svg>
  );
}

export function EveulLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-gold", className)}>
      <EveulMark className="h-6 w-7" />
      <span className="font-display text-xl font-bold leading-none tracking-[0.16em]">EVEUL</span>
    </span>
  );
}
