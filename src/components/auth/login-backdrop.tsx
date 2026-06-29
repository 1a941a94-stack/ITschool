"use client";

import { motion } from "framer-motion";

export function LoginBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.18),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.14),transparent_38%),linear-gradient(135deg,#f8fbff_0%,#eef4ff_45%,#ffffff_100%)]" />
      <motion.div
        className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 24, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-[-4rem] h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, -20, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300/15 blur-3xl"
        animate={{ opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />
    </div>
  );
}
