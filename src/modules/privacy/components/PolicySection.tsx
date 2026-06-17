'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface PolicySectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  index: number;
  color: string;
}

export function PolicySection({ icon, title, children, index, color }: PolicySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: '-10% 0px -10% 0px', once: false });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 30 }}
      animate={isInView ? { y: 0 } : { y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-surface-container/50 border-outline/10 hover:border-primary/30 hover:shadow-primary/5 relative overflow-hidden rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-xl md:p-8">
        {/* Decorative gradient */}
        <div
          className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-linear-to-br ${color} opacity-10 blur-3xl transition-opacity duration-300 group-hover:opacity-20`}
        />

        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-3">
            <div className={`rounded-xl bg-linear-to-br ${color} p-3 text-white shadow-lg`}>{icon}</div>
            <h3 className="text-on-surface text-xl font-bold md:text-2xl">{title}</h3>
          </div>
          <div className="text-on-surface-variant space-y-3 text-base leading-relaxed md:text-lg">{children}</div>
        </div>
      </div>
    </motion.div>
  );
}
