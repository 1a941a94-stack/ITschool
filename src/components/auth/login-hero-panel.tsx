"use client";

import { motion } from "framer-motion";

const particles = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 17) % 84)}%`,
  top: `${10 + ((index * 23) % 78)}%`,
  size: 4 + (index % 4) * 2,
  delay: index * 0.35,
  duration: 4 + (index % 5),
}));

export function LoginHeroPanel() {
  return (
    <section className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,#020617_0%,#0f172a_28%,#1e3a8a_62%,#2563eb_100%)]" />

      <motion.div
        className="absolute -left-20 top-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-400/20 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-8%] right-[-6%] h-[480px] w-[480px] rounded-full bg-indigo-500/25 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[35%] top-[38%] h-64 w-64 rounded-full bg-blue-300/10 blur-3xl"
        animate={{ opacity: [0.25, 0.65, 0.25], scale: [0.9, 1.2, 0.9] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:64px_64px]" />

      <motion.div
        className="absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.08)_45%,transparent_90%)]"
        animate={{ x: ["-30%", "130%"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 flex flex-1 items-center justify-center p-12">
        <div className="relative flex h-[min(72vh,620px)] w-full max-w-xl items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border border-white/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-8 rounded-full border border-dashed border-white/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-16 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" fill="none" aria-hidden>
            <motion.circle
              cx="200"
              cy="200"
              r="120"
              stroke="url(#heroRing)"
              strokeWidth="1.5"
              strokeDasharray="8 14"
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "200px 200px" }}
            />
            <defs>
              <linearGradient id="heroRing" x1="80" y1="80" x2="320" y2="320">
                <stop stopColor="#93C5FD" stopOpacity="0.1" />
                <stop offset="0.5" stopColor="#60A5FA" stopOpacity="0.9" />
                <stop offset="1" stopColor="#BFDBFE" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>

          {particles.map((particle) => (
            <motion.span
              key={particle.id}
              className="absolute rounded-full bg-white/80 shadow-[0_0_18px_rgba(147,197,253,0.8)]"
              style={{
                left: particle.left,
                top: particle.top,
                width: particle.size,
                height: particle.size,
              }}
              animate={{ y: [0, -18, 0], opacity: [0.15, 0.9, 0.15] }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.delay,
              }}
            />
          ))}

          <div className="relative z-10 max-w-sm px-6 text-center">
            <motion.p
              className="text-xs font-semibold tracking-[0.38em] text-blue-200/80 uppercase"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Центр IT Карьеры
            </motion.p>
            <motion.h2
              className="mt-5 text-4xl font-semibold tracking-tight text-white xl:text-5xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              Продавай технологии
            </motion.h2>
            <motion.p
              className="mt-3 text-2xl font-medium text-blue-100/90 xl:text-3xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              Создавай будущее
            </motion.p>
            <motion.div
              className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-blue-300 to-transparent"
              animate={{ scaleX: [0.6, 1.2, 0.6], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 px-12 py-6">
        <motion.div
          className="flex items-center gap-3 text-sm text-blue-100/70"
          animate={{ opacity: [0.45, 0.95, 0.45] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
          Платформа обучения и карьерного роста
        </motion.div>
      </div>
    </section>
  );
}
