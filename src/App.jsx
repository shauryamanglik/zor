import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "./hooks/useStore";
import NavBar from "./components/shared/NavBar";
import Onboarding from "./components/onboarding/Onboarding";
import Home from "./components/home/Home";
import Food from "./components/food/Food";
import Gym from "./components/gym/Gym";
import Settings from "./components/settings/Settings";
import { startReminderLoop, requestNotifPermission } from "./lib/notifications";

export default function App() {
  const store = useStore();
  const [tab, setTab] = useState("home");

  // Start the reminder loop once onboarded
  useEffect(() => {
    if (!store.onboarded) return;
    requestNotifPermission();
    const stop = startReminderLoop(() => store.reminders);
    return stop;
  }, [store.onboarded, store.reminders]);

  // Apply accent color as CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty("--zor-accent", store.accent);
  }, [store.accent]);

  if (!store.ready) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0.3 }} animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
          className="font-display text-5xl font-bold text-gold"
        >
          Zor
        </motion.div>
      </div>
    );
  }

  if (!store.onboarded) {
    return <Onboarding />;
  }

  const tabs = { home: Home, food: Food, gym: Gym, settings: Settings };
  const Active = tabs[tab];

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          <Active setTab={setTab} />
        </motion.div>
      </AnimatePresence>
      <NavBar tab={tab} setTab={setTab} />
    </div>
  );
}
