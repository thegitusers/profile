"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface Stat {
  number: number;
  suffix: string;
  label: string;
  sublabel?: string;
}

const stats: Stat[] = [
  { number: 52, suffix: "+", label: "Projects Delivered", sublabel: "Across 14 countries" },
  { number: 100, suffix: "%", label: "Responsive Design", sublabel: "Every pixel perfect" },
  { number: 99, suffix: "%", label: "Client Satisfaction", sublabel: "Based on 48 reviews" },
  { number: 2.5, suffix: "+", label: "Years Experience", sublabel: "Full-time freelance" },
];

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1400;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start * 10) / 10);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="stat-number tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

export default function StatsCounter() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/10 rounded-3xl overflow-hidden border border-black/10">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-8 text-center border-r border-black/10 last:border-r-0">
          <div className="font-semibold text-6xl tracking-[-2.5px] mb-1.5 tabular-nums">
            <AnimatedNumber target={stat.number} suffix={stat.suffix} />
          </div>
          <div className="font-medium text-sm tracking-wider mb-1">{stat.label}</div>
          {stat.sublabel && <div className="text-xs text-black/40">{stat.sublabel}</div>}
        </div>
      ))}
    </div>
  );
}
