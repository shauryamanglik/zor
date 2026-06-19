import { Home, UtensilsCrossed, Dumbbell, Settings } from "lucide-react";
import { haptic } from "../../lib/utils";

const TABS = [
  { id: "home", label: "Home", icon: Home },
  { id: "food", label: "Food", icon: UtensilsCrossed },
  { id: "gym", label: "Gym", icon: Dumbbell },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function NavBar({ tab, setTab }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-surface/95 backdrop-blur border-t border-line safe-bottom z-40">
      <div className="flex">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => { haptic("light"); setTab(t.id); }}
              className="flex-1 flex flex-col items-center gap-1 py-2.5"
            >
              <Icon
                className={active ? "text-gold" : "text-ink-faint"}
                strokeWidth={active ? 2.4 : 1.8}
                size={22}
              />
              <span className={`text-[10px] font-medium ${active ? "text-gold" : "text-ink-faint"}`}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
