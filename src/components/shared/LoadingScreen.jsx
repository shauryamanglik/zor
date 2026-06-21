import { useEffect } from "react";
import { motion } from "framer-motion";

// Splash: the gold Z-bolt logo flies in, then "Zor" rises beneath it.
// Logo lives at /icon-512.png (gold metallic Z on transparent). If it ever
// fails to load we fall back to a crafted SVG bolt so the splash never breaks.
export default function LoadingScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 1250);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg overflow-hidden">
      {/* Radial glow behind the mark */}
      <motion.div
        className="absolute w-64 h-64 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0) 70%)" }}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -14, y: 6 }}
        animate={{ scale: 1, opacity: 1, rotate: 0, y: 0 }}
        transition={{ type: "spring", damping: 10, stiffness: 170 }}
        className="relative mb-5"
      >
        <motion.img
          src="/icon-512.png"
          alt="Zor"
          className="w-28 h-28 object-contain"
          style={{ filter: "drop-shadow(0 0 22px rgba(201,168,76,0.55))" }}
          initial={{ filter: "brightness(0.5) drop-shadow(0 0 0 rgba(201,168,76,0))" }}
          animate={{ filter: "brightness(1.2) drop-shadow(0 0 22px rgba(201,168,76,0.55))" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 12, letterSpacing: "0.5em" }}
        animate={{ opacity: 1, y: 0, letterSpacing: "0.02em" }}
        transition={{ duration: 0.55, delay: 0.3, ease: "easeOut" }}
        className="font-display text-5xl font-bold text-gold relative"
      >
        Zor
      </motion.div>
    </div>
  );
}
