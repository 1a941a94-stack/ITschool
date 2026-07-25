"use client";

import { motion } from "framer-motion";

export function LandingHeroBackdrop() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(145deg,#020617_0%,#0f172a_28%,#1e3a8a_62%,#2563eb_100%)]" />
      <motion.div
        className="absolute -left-20 top-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-400/20 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-8%] right-[-6%] h-[480px] w-[480px] rounded-full bg-blue-400/20 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:64px_64px]" />
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.08)_45%,transparent_90%)]"
        animate={{ x: ["-30%", "130%"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
      />
    </>
  );
}
