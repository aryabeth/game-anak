"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  createGateChallenge,
  unlockParentArea,
  useParentUnlocked,
  type GateChallenge,
} from "@/lib/parent-lock";

const HOLD_MS = 3000;

type Step = { kind: "hold" } | { kind: "challenge"; challenge: GateChallenge };

/**
 * Two-step parent gate: hold a button for three seconds, then tap the numeral
 * for a number written in words. Young children are unlikely to pass both by
 * accident, but this is a speed bump, not a security control.
 */
export function ParentGate({ children }: { children: React.ReactNode }) {
  const unlocked = useParentUnlocked();
  if (unlocked) return <>{children}</>;
  return <GateForm />;
}

function GateForm() {
  const [step, setStep] = useState<Step>({ kind: "hold" });
  const [message, setMessage] = useState<string | null>(null);

  // Start again from the first step whenever this page is hidden.
  useLayoutEffect(() => {
    return () => {
      setStep({ kind: "hold" });
      setMessage(null);
    };
  }, []);

  return (
    <section className="card mx-auto mt-6 w-full max-w-lg p-6 sm:p-8" aria-labelledby="gate-title">
      <h1 id="gate-title" className="text-2xl font-extrabold text-sage-dark">
        Khusus orang tua
      </h1>
      <p className="mt-2 text-muted">
        Bagian ini berisi pengaturan dan catatan belajar. Mohon orang tua atau pendamping yang membukanya.
      </p>

      {step.kind === "hold" ? (
        <HoldButton
          onComplete={() => {
            setMessage(null);
            setStep({ kind: "challenge", challenge: createGateChallenge() });
          }}
        />
      ) : (
        <div className="mt-6">
          <p className="font-bold" id="challenge-label">
            Langkah 2 dari 2: ketuk angka <span className="text-sage-dark">“{step.challenge.words}”</span>
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3" role="group" aria-labelledby="challenge-label">
            {step.challenge.options.map((n) => (
              <button
                key={n}
                type="button"
                className="btn-secondary min-h-16 text-2xl"
                onClick={() => {
                  if (n === step.challenge.target) {
                    unlockParentArea();
                  } else {
                    setMessage("Angkanya belum cocok. Silakan ulangi dari langkah 1.");
                    setStep({ kind: "hold" });
                  }
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-4 min-h-6 text-sm font-semibold text-terracotta-dark" role="status">
        {message}
      </p>
    </section>
  );
}

function HoldButton({ onComplete }: { onComplete: () => void }) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const start = () => {
    if (timer.current) return;
    setHolding(true);
    timer.current = setTimeout(() => {
      timer.current = undefined;
      setHolding(false);
      onComplete();
    }, HOLD_MS);
  };
  const cancel = () => {
    clearTimeout(timer.current);
    timer.current = undefined;
    setHolding(false);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div className="mt-6">
      <p className="font-bold" id="hold-label">
        Langkah 1 dari 2: tekan dan tahan tombol di bawah selama 3 detik.
      </p>
      <button
        type="button"
        aria-describedby="hold-label"
        className="relative mt-4 flex min-h-16 w-full cursor-pointer touch-none items-center justify-center overflow-hidden rounded-full border-2 border-sage-dark/30 bg-sage/60 text-lg font-bold text-sage-dark select-none"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          start();
        }}
        onPointerUp={cancel}
        onPointerCancel={cancel}
        onLostPointerCapture={cancel}
        onKeyDown={(e) => {
          if ((e.key === " " || e.key === "Enter") && !e.repeat) {
            e.preventDefault();
            start();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === " " || e.key === "Enter") cancel();
        }}
        onBlur={cancel}
        onContextMenu={(e) => e.preventDefault()}
      >
        <span
          aria-hidden="true"
          className="motion-exempt absolute inset-y-0 left-0 bg-sage-dark/25"
          style={{
            width: holding ? "100%" : "0%",
            transition: holding ? `width ${HOLD_MS}ms linear` : "width 150ms ease-out",
          }}
        />
        <span className="relative">{holding ? "Terus tahan…" : "Tahan 3 detik"}</span>
      </button>
    </div>
  );
}
