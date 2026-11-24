// components/brand/inline-video.tsx
"use client";

import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Vídeo curto sem som, com botão de play/pause (44px+).
 * preload="none": não gasta dados móveis até o utilizador carregar em play.
 */
export function InlineVideo({
  src,
  poster,
  label,
  className,
}: {
  src: string;
  poster: string;
  /** Descrição do vídeo para leitores de ecrã */
  label: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;

    try {
      if (v.paused) {
        v.muted = true;
        v.playsInline = true;
        await v.play();
      } else {
        v.pause();
      }
    } catch {
      // se o browser bloquear, mostra os controlos nativos
      v.controls = true;
    }
  };

  return (
    <div className={cn("relative overflow-hidden bg-sunken", className)}>
      <video
        ref={videoRef}
        className="size-full object-cover"
        src={src}
        poster={poster}
        playsInline
        muted
        loop
        preload="none"
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        aria-label={label}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
      <Button
        type="button"
        onClick={togglePlay}
        size="icon-lg"
        className="absolute bottom-4 left-4"
        aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
      >
        {isPlaying ? <Pause /> : <Play />}
      </Button>
    </div>
  );
}
