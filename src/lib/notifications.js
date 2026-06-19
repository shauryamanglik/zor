// Local notification scheduling for Zor.
// iOS PWA web push requires the app be installed to home screen (iOS 16.4+)
// and notification permission granted. These are local reminders scheduled
// while the app/service worker is alive; for guaranteed background delivery
// you would add a push server later. This covers in-session + soft reminders.

export async function requestNotifPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  const res = await Notification.requestPermission();
  return res;
}

export function notify(title, body) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: "/icon-192.png", badge: "/icon-192.png" });
  } catch {
    // Some iOS versions require ServiceWorkerRegistration.showNotification
    navigator.serviceWorker?.ready.then((reg) =>
      reg.showNotification(title, { body, icon: "/icon-192.png" })
    );
  }
}

// Default reminder schedule — overridable in Settings.
export const DEFAULT_REMINDERS = [
  { id: "supps-am", time: "07:00", label: "Morning supplements", days: [0, 1, 2, 3, 4, 5, 6], on: true },
  { id: "breakfast", time: "07:15", label: "Breakfast time", days: [1, 2, 3, 4, 5], on: true },
  { id: "tiffin", time: "07:30", label: "Pack your tiffin", days: [1, 2, 3, 4, 5], on: true },
  { id: "pregym", time: "16:30", label: "Pre-gym shake — gym soon", days: [1, 2, 3, 4, 6], on: true, gymOnly: true },
  { id: "dinner", time: "20:30", label: "Dinner time", days: [0, 1, 2, 3, 4, 5, 6], on: true },
  { id: "magnesium", time: "21:45", label: "Magnesium — 30 min before bed", days: [0, 1, 2, 3, 4, 5, 6], on: true },
  { id: "snack", time: "22:00", label: "Evening snack — check your protein", days: [0, 1, 2, 3, 4, 5, 6], on: true },
  { id: "prep", time: "11:00", label: "Sunday prep block — 7 tasks", days: [0], on: true },
];

// Lightweight in-app scheduler: checks every minute against reminders.
export function startReminderLoop(getReminders) {
  let lastFired = "";
  const tick = () => {
    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const stamp = `${now.toDateString()}-${hhmm}`;
    if (stamp === lastFired) return;
    const reminders = getReminders();
    reminders.forEach((r) => {
      if (!r.on) return;
      if (r.time === hhmm && r.days.includes(now.getDay())) {
        notify("Zor", r.label);
        lastFired = stamp;
      }
    });
  };
  const interval = setInterval(tick, 30000);
  return () => clearInterval(interval);
}
