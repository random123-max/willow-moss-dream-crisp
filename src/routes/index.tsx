import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GiftBox } from "@/components/gift-box";
import { PackPanel } from "@/components/pack-panel";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [open, setOpen] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const stored = sessionStorage.getItem("helios-gift-open") === "1";
    if (q.get("open") === "1" || stored) {
      setOpen(true);
      setShowPanel(true);
    }
  }, []);

  function openGift() {
    setOpen(true);
    sessionStorage.setItem("helios-gift-open", "1");
    window.setTimeout(() => setShowPanel(true), 700);
  }

  return (
    <main className="min-h-dvh bg-bg">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(62,224,208,0.08),transparent_55%)]" />
      </div>

      {!showPanel ? (
        <section className="relative flex min-h-dvh flex-col items-center justify-center px-5 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-ember">
            For a space lover
          </p>
          <h1 className="mt-3 max-w-xl font-display text-4xl leading-tight text-fg md:text-6xl">
            A gift packed for Minecraft nights.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted md:text-base">
            Tap the box. Inside is the Helios outpost, the Education add-on, and a code you can
            send with the link.
          </p>
          <div className="mt-10">
            <GiftBox open={open} onOpen={openGift} />
          </div>
        </section>
      ) : (
        <div className="relative pt-8">
          <PackPanel playHref="/play" />
        </div>
      )}
    </main>
  );
}
