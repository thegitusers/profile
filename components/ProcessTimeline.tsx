"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const steps = [
  { 
    number: "01", 
    title: "Discover", 
    desc: "Deep dive into your business goals, users, and technical requirements through collaborative workshops." 
  },
  { 
    number: "02", 
    title: "Plan", 
    desc: "Architecture, user flows, tech stack selection, timeline, and clear deliverables defined together." 
  },
  { 
    number: "03", 
    title: "Design", 
    desc: "High-fidelity interfaces, interaction systems, and premium visual language tailored to your brand." 
  },
  { 
    number: "04", 
    title: "Develop", 
    desc: "Clean, scalable code. Weekly demos. Performance-first implementation with modern best practices." 
  },
  { 
    number: "05", 
    title: "Deploy", 
    desc: "Seamless launch, analytics setup, SEO, and handoff documentation. Zero downtime guaranteed." 
  },
  { 
    number: "06", 
    title: "Support", 
    desc: "Ongoing maintenance, iterations, and priority support. Your long-term digital partner." 
  },
];

export default function ProcessTimeline() {
  return (
    <div className="max-w-3xl mx-auto">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.07 }}
          className="timeline-item group mb-12 last:mb-0"
        >
          <div className="timeline-dot group-hover:bg-black group-hover:text-white transition-all">
            <Check size={15} className="opacity-70 group-hover:opacity-100" />
          </div>
          
          <div className="flex items-start gap-6">
            <div className="font-mono text-6xl font-semibold tracking-[-3.5px] text-black/10 w-20 shrink-0 pt-1">
              {step.number}
            </div>
            <div className="-mt-1">
              <h4 className="font-semibold text-2xl tracking-[-0.8px] mb-2.5">{step.title}</h4>
              <p className="text-[15px] text-black/60 leading-relaxed max-w-[46ch]">{step.desc}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
