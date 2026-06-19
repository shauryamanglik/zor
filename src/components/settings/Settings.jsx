import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Pill, Bell, Ruler, Cloud, ChevronRight, Check, RefreshCw, LogOut, Scale, Palette, Download, User } from "lucide-react";
import { useStore } from "../../hooks/useStore";
import { Card, Button, Sheet } from "../shared/UI";
import { haptic } from "../../lib/utils";

export default function Settings() {
  const store = useStore();
  const [sheet, setSheet] = useState(null);

  const sections = [
    { id: "supplements", label: "Supplements", icon: Pill, sub: `${store.supplements.filter((s) => s.state === "active").length} active` },
    { id: "notifications", label: "Notifications", icon: Bell, sub: `${store.reminders.filter((r) => r.on).length} on` },
    { id: "body", label: "Body Stats", icon: Ruler, sub: `${store.bodyStats.length} logged` },
    { id: "units", label: "Units", icon: Scale, sub: store.units },
    { id: "appearance", label: "Appearance", icon: Palette, sub: "Gold" },
    { id: "data", label: "Data & Sync", icon: Cloud, sub: store.signedIn ? "Connected" : "Not connected" },
  ];

  return (
    <div className="px-4 pt-4 pb-28 safe-top">
      <h1 className="font-display text-2xl font-bold mb-1">Settings</h1>
      <p className="text-xs text-ink-dim mb-5">{store.userName} · Zor</p>

      <div className="space-y-2">
        {sections.map((s) => (
          <Card key={s.id} onClick={() => { haptic("light"); setSheet(s.id); }} className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-btn bg-surface-2 flex items-center justify-center">
              <s.icon className="w-4 h-4 text-gold" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{s.label}</p>
              <p className="text-[11px] text-ink-dim">{s.sub}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-faint" />
          </Card>
        ))}
      </div>

      <p className="text-center text-[10px] text-ink-faint mt-8">Zor v1.0 · Built for {store.userName}</p>

      <AnimatePresence>
        {sheet === "supplements" && <Sheet open onClose={() => setSheet(null)} title="Supplements"><SupplementsPanel /></Sheet>}
        {sheet === "notifications" && <Sheet open onClose={() => setSheet(null)} title="Notifications"><NotificationsPanel /></Sheet>}
        {sheet === "body" && <Sheet open onClose={() => setSheet(null)} title="Body Stats"><BodyPanel /></Sheet>}
        {sheet === "units" && <Sheet open onClose={() => setSheet(null)} title="Units"><UnitsPanel /></Sheet>}
        {sheet === "appearance" && <Sheet open onClose={() => setSheet(null)} title="Appearance"><AppearancePanel /></Sheet>}
        {sheet === "data" && <Sheet open onClose={() => setSheet(null)} title="Data & Sync"><DataPanel /></Sheet>}
      </AnimatePresence>
    </div>
  );
}

function SupplementsPanel() {
  const store = useStore();
  const cycle = (id) => {
    haptic("light");
    const next = store.supplements.map((s) =>
      s.id === id
        ? { ...s, state: s.state === "coming" ? "active" : s.state === "active" ? "skip" : "coming" }
        : s
    );
    store.updateSupplements(next);
  };
  const label = { coming: "Coming Soon", active: "Have it", skip: "Skip" };
  const color = { coming: "text-warn", active: "text-success", skip: "text-ink-faint" };
  return (
    <div className="space-y-2">
      <p className="text-xs text-ink-dim mb-2">Tap to cycle: Coming Soon → Have it → Skip. Active ones show in your daily checklist + reminders. Coming-soon ones go on your grocery list.</p>
      {store.supplements.map((s) => (
        <Card key={s.id} onClick={() => cycle(s.id)} className="p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-2">
              <p className="font-medium text-sm">{s.name}</p>
              <p className="text-[11px] text-ink-dim mt-0.5">{s.dose} · {s.timing}</p>
            </div>
            <span className={`text-[11px] font-semibold ${color[s.state]}`}>{label[s.state]}</span>
          </div>
          <p className="text-[10px] text-ink-faint mt-2 leading-relaxed">{s.why}</p>
          <p className="text-[10px] text-gold mt-1">{s.buy}</p>
        </Card>
      ))}
    </div>
  );
}

function NotificationsPanel() {
  const store = useStore();
  const toggle = (id) => {
    haptic("light");
    store.updateReminders(store.reminders.map((r) => (r.id === id ? { ...r, on: !r.on } : r)));
  };
  const setTime = (id, time) => {
    store.updateReminders(store.reminders.map((r) => (r.id === id ? { ...r, time } : r)));
  };
  return (
    <div className="space-y-2">
      <p className="text-xs text-ink-dim mb-2">Toggle each reminder and set its time. Changes save instantly.</p>
      {store.reminders.map((r) => (
        <Card key={r.id} className="p-3 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium">{r.label}</p>
            <input
              type="time" value={r.time} onChange={(e) => setTime(r.id, e.target.value)}
              className="text-[11px] text-ink-dim bg-transparent mt-0.5 outline-none"
            />
          </div>
          <button onClick={() => toggle(r.id)} className={`w-11 h-6 rounded-full transition-colors relative ${r.on ? "bg-gold" : "bg-line"}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-bg transition-transform ${r.on ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </Card>
      ))}
    </div>
  );
}

function BodyPanel() {
  const store = useStore();
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [chest, setChest] = useState("");
  const [arms, setArms] = useState("");

  const save = () => {
    haptic("success");
    store.logBodyStat({ weight, chest, waist, arms, notes: "" });
    setWeight(""); setWaist(""); setChest(""); setArms("");
  };
  return (
    <div>
      <p className="text-xs text-ink-dim mb-3">Log your weekly check-in. Only weight is needed — measurements are optional.</p>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <input value={weight} onChange={(e) => setWeight(e.target.value)} type="number" inputMode="decimal" placeholder={`Weight (${store.units === "lbs" ? "lbs" : "kg"})`} className="bg-surface-2 rounded-btn px-3 py-2.5 text-sm outline-none" />
        <input value={waist} onChange={(e) => setWaist(e.target.value)} type="number" inputMode="decimal" placeholder="Waist (in)" className="bg-surface-2 rounded-btn px-3 py-2.5 text-sm outline-none" />
        <input value={chest} onChange={(e) => setChest(e.target.value)} type="number" inputMode="decimal" placeholder="Chest (in)" className="bg-surface-2 rounded-btn px-3 py-2.5 text-sm outline-none" />
        <input value={arms} onChange={(e) => setArms(e.target.value)} type="number" inputMode="decimal" placeholder="Arms (in)" className="bg-surface-2 rounded-btn px-3 py-2.5 text-sm outline-none" />
      </div>
      <Button className="w-full mb-4" disabled={!weight} onClick={save}>Log Check-in</Button>
      {store.bodyStats.length > 0 && (
        <>
          <p className="text-[11px] text-ink-dim uppercase tracking-wide mb-2">History</p>
          <Card className="divide-y divide-line">
            {store.bodyStats.slice().reverse().map((b, i) => (
              <div key={i} className="flex items-center justify-between p-3">
                <span className="text-xs text-ink-dim">{b.date}</span>
                <span className="text-sm tabular">{b.weight} {store.units}</span>
              </div>
            ))}
          </Card>
        </>
      )}
    </div>
  );
}

function UnitsPanel() {
  const store = useStore();
  return (
    <div className="space-y-2">
      {["lbs", "kg"].map((u) => (
        <Card key={u} onClick={() => { haptic("light"); store.setUnits(u); }} className="p-4 flex items-center justify-between">
          <span className="text-sm font-medium uppercase">{u}</span>
          {store.units === u && <Check className="w-5 h-5 text-gold" />}
        </Card>
      ))}
    </div>
  );
}

function AppearancePanel() {
  const store = useStore();
  const colors = [
    { name: "Gold", hex: "#C9A84C" },
    { name: "Emerald", hex: "#4CAF7D" },
    { name: "Azure", hex: "#6BA4E0" },
    { name: "Crimson", hex: "#E05C5C" },
    { name: "Violet", hex: "#9B6BE0" },
  ];
  return (
    <div>
      <p className="text-xs text-ink-dim mb-3">Zor is a dark app by design. Pick your accent color.</p>
      <div className="grid grid-cols-5 gap-3">
        {colors.map((c) => (
          <button key={c.hex} onClick={() => { haptic("light"); store.setAccent(c.hex); }} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: c.hex }}>
              {store.accent === c.hex && <Check className="w-5 h-5 text-bg" strokeWidth={3} />}
            </div>
            <span className="text-[9px] text-ink-dim">{c.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DataPanel() {
  const store = useStore();
  const [confirming, setConfirming] = useState(false);

  const exportJSON = () => {
    const data = { meals: store.meals, workouts: store.workouts, prs: store.prs, bodyStats: store.bodyStats };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "zor-data.json"; a.click();
  };

  const handleReset = async () => {
    haptic("heavy");
    await store.clearAllData();
    setConfirming(false);
  };
  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Cloud className="w-4 h-4 text-gold" />
          <span className="font-medium text-sm">Google Sheets</span>
        </div>
        {store.signedIn ? (
          <>
            <p className="text-xs text-success mb-1">Connected</p>
            <p className="text-[11px] text-ink-dim mb-3">
              {store.lastSync ? `Last synced ${store.lastSync.toLocaleTimeString()}` : "Syncing…"}
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => { haptic("medium"); store.fullSync(); }}>
                <RefreshCw className="inline w-4 h-4 mr-1" /> Sync Now
              </Button>
              <Button variant="danger" onClick={() => { haptic("medium"); store.disconnect(); }}>
                <LogOut className="inline w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-[11px] text-ink-dim mb-3">Connect to save everything to your private Google Sheet. Your data survives even if you delete the app.</p>
            <Button className="w-full" onClick={async () => { haptic("medium"); try { await store.connect(); } catch (e) { alert(e.message); } }}>
              Connect Google Sheets
            </Button>
          </>
        )}
      </Card>

      <Card className="p-4" onClick={exportJSON}>
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-gold" />
          <div>
            <p className="text-sm font-medium">Export Data (JSON)</p>
            <p className="text-[11px] text-ink-dim">Download a local backup of everything.</p>
          </div>
        </div>
      </Card>

      {!confirming ? (
        <Card className="p-4 border-danger/20" onClick={() => { haptic("medium"); setConfirming(true); }}>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 text-danger flex items-center justify-center font-bold text-sm">✕</div>
            <div>
              <p className="text-sm font-medium text-danger">Reset All Data</p>
              <p className="text-[11px] text-ink-dim">Clears local cache and Sheets logs. Settings stay.</p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-4 border-danger/40 bg-danger/5">
          <p className="text-sm font-medium text-danger mb-1">Are you sure?</p>
          <p className="text-[11px] text-ink-dim mb-3">This deletes all meal logs, workout logs, PRs, and body stats from both the app and your Google Sheet. Cannot be undone.</p>
          <div className="flex gap-2">
            <Button variant="ghost" className="flex-1" onClick={() => setConfirming(false)}>Cancel</Button>
            <Button variant="danger" className="flex-1" onClick={handleReset}>Yes, reset</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
