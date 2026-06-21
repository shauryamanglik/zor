import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "./hooks/useStore";
import NavBar from "./components/shared/NavBar";
import Onboarding from "./components/onboarding/Onboarding";
import Home from "./components/home/Home";
import Food from "./components/food/Food";
import Gym from "./components/gym/Gym";
import Settings from "./components/settings/Settings";
import LoadingScreen from "./components/shared/LoadingScreen";
import { startReminderLoop, requestNotifPermission } from "./lib/notifications";
import { applyAccent } from "./lib/utils";

export default function App() {
  const store = useStore();
  const [tab, setTab] = useState("home");
  const [splashDone, setSplashDone] = useState(false);

  // Start the reminder loop once onboarded
  useEffect(() => {
    if (!store.onboarded) return;
    requestNotifPermission();
    const stop = startReminderLoop(() => store.reminders);
    return stop;
  }, [store.onboarded, store.reminders]);

  // Apply accent color across the whole app (recolors every gold token).
  useEffect(() => {
    applyAccent(store.accent || "#C9A84C");
  }, [store.accent]);

  // Show the animated splash until both the store is ready AND the splash
  // animation has had its moment.
  if (!store.ready || !splashDone) {
    return <LoadingScreen onDone={() => setSplashDone(true)} />;
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
