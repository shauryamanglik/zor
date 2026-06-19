import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Check, Sparkles } from "lucide-react";
import { useStore } from "../../hooks/useStore";
import { SUPPLEMENTS } from "../../data/workouts";
import { Button, Card } from "../shared/UI";
import { haptic } from "../../lib/utils";

export default function Onboarding() {
  const { finishOnboarding, connect, signedIn, userName } = useStore();
  const [step, setStep] = useState(0);
  const [supps, setSupps] = useState(SUPPLEMENTS.map((s) => ({ ...s, state: "coming" })));

  const cycle = (id) => {
    haptic("light");
    setSupps((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, state: s.state === "coming" ? "active" : s.state === "active" ? "skip" : "coming" }
          : s
      )
    );
  };

  const stateLabel = { coming: "Coming Soon", active: "Have it", skip: "Skip" };
  const stateColor = { coming: "text-warn", active: "text-success", skip: "text-ink-faint" };

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 safe-top safe-bottom">
      {step === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col justify-center">
          <div className="font-display text-6xl font-bold text-gold mb-3">Zor</div>
          <h1 className="font-display text-2xl font-semibold mb-2">Welcome, {userName}.</h1>
          <p className="text-ink-dim text-sm leading-relaxed mb-1">
            Your body, your discipline, your force. Zor runs your nutrition and training as one system — built only for you.
          </p>
          <p className="text-ink-faint text-xs leading-relaxed">
            No deadlines. No phases. Just continuous progress that compounds.
          </p>
          <Button className="mt-8 w-full" onClick={() => { haptic("medium"); setStep(1); }}>
            Get Started <ChevronRight className="inline w-4 h-4" />
          </Button>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col">
          <h2 className="font-display text-xl font-semibold mb-1">Your supplements</h2>
          <p className="text-ink-dim text-xs mb-5">
            Tap to cycle: Coming Soon → Have it → Skip. You don't have any yet, so they default to Coming Soon and show up in your grocery list. Change anytime.
          </p>
          <div className="space-y-2 flex-1 overflow-y-auto">
            {supps.map((s) => (
              <Card key={s.id} onClick={() => cycle(s.id)} className="p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-3">
                    <p className="font-medium text-sm">{s.name}</p>
                    <p className="text-[11px] text-ink-dim mt-0.5">{s.dose} · {s.timing}</p>
                  </div>
                  <span className={`text-[11px] font-semibold ${stateColor[s.state]}`}>
                    {stateLabel[s.state]}
                  </span>
                </div>
                <p className="text-[10px] text-ink-faint mt-2 leading-relaxed">{s.why}</p>
              </Card>
            ))}
          </div>
          <Button className="mt-4 w-full" onClick={() => { haptic("medium"); setStep(2); }}>
            Continue <ChevronRight className="inline w-4 h-4" />
          </Button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col justify-center">
          <Sparkles className="w-10 h-10 text-gold mb-4" strokeWidth={1.5} />
          <h2 className="font-display text-2xl font-semibold mb-2">Connect your data</h2>
          <p className="text-ink-dim text-sm leading-relaxed mb-6">
            Zor saves everything to your private Google Sheet. Your data survives even if you delete the app — sign in once and it's yours forever. Two-way sync, always.
          </p>
          {signedIn ? (
            <div className="flex items-center gap-2 text-success text-sm mb-6">
              <Check className="w-5 h-5" /> Connected to Google Sheets
            </div>
          ) : (
            <Button variant="ghost" className="w-full mb-3" onClick={async () => {
              haptic("medium");
              try { await connect(); } catch (e) { alert("Sign-in failed: " + e.message); }
            }}>
              Connect Google Sheets
            </Button>
          )}
          <Button className="w-full" onClick={() => { haptic("success"); finishOnboarding(supps); }}>
            Enter Zor
          </Button>
          {!signedIn && (
            <p className="text-[10px] text-ink-faint mt-3 text-center">
              You can connect later in Settings — Zor works offline and syncs when you connect.
            </p>
          )}
        </motion.div>
      )}

      <div className="flex justify-center gap-1.5 mt-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-1 rounded-full transition-all ${i === step ? "w-6 bg-gold" : "w-1.5 bg-line"}`} />
        ))}
      </div>
    </div>
  );
}
