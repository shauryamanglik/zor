import { motion } from "framer-motion";

export function Card({ children, className = "", onClick, ...rest }) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface border border-line rounded-card ${onClick ? "active:scale-[0.99] transition-transform cursor-pointer" : ""} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Pill({ children, color = "gold" }) {
  const map = {
    gold: "bg-gold/15 text-gold",
    green: "bg-success/15 text-success",
    red: "bg-danger/15 text-danger",
    grey: "bg-ink-faint/15 text-ink-dim",
  };
  return <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${map[color]}`}>{children}</span>;
}

// Animated SVG progress ring
export function Ring({ value, max, size = 64, stroke = 7, color = "#C9A84C", label, sub }) {
  const pct = Math.min(1, max ? value / max : 0);
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2A2D35" strokeWidth={stroke} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeLinecap="round" strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - pct) }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-sm font-semibold tabular">{Math.round(value)}</span>
          {sub && <span className="text-[9px] text-ink-dim">{sub}</span>}
        </div>
      </div>
      {label && <span className="text-[10px] text-ink-dim uppercase tracking-wide">{label}</span>}
    </div>
  );
}

export function Button({ children, onClick, variant = "primary", className = "", disabled }) {
  const base = "rounded-btn font-medium text-sm py-3 px-5 transition-all active:scale-[0.97] disabled:opacity-40";
  const variants = {
    primary: "bg-gold text-bg font-semibold",
    ghost: "bg-surface-2 text-ink border border-line",
    danger: "bg-danger/15 text-danger border border-danger/30",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function Stepper({ value, onChange, step = 5, min = 0, suffix = "" }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        className="w-11 h-11 rounded-btn bg-surface-2 border border-line text-xl font-display active:scale-95 text-gold"
      >−</button>
      <div className="flex-1 text-center">
        <input
          type="number" inputMode="decimal" value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full bg-transparent text-center font-display text-3xl font-semibold tabular outline-none"
        />
        {suffix && <span className="text-[10px] text-ink-dim block -mt-1">{suffix}</span>}
      </div>
      <button
        onClick={() => onChange(value + step)}
        className="w-11 h-11 rounded-btn bg-surface-2 border border-line text-xl font-display active:scale-95 text-gold"
      >+</button>
    </div>
  );
}

export function Sheet({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-[480px] bg-surface border-t border-line rounded-t-3xl p-5 pb-8 max-h-[85vh] overflow-y-auto safe-bottom"
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        <div className="w-10 h-1 bg-line rounded-full mx-auto mb-4" />
        {title && <h3 className="font-display text-lg font-semibold mb-4">{title}</h3>}
        {children}
      </motion.div>
    </motion.div>
  );
}

export function EmptyState({ icon: Icon, title, sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && <Icon className="w-10 h-10 text-ink-faint mb-3" strokeWidth={1.5} />}
      <p className="font-display text-base text-ink-dim">{title}</p>
      {sub && <p className="text-xs text-ink-faint mt-1 max-w-[240px]">{sub}</p>}
    </div>
  );
}
