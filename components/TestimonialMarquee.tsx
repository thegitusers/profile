"use client";

import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Ananya Rao",
    role: "Founder",
    company: "Andaman Explorer",
    quote: "SHIV completely transformed our online presence. The booking system he built increased our direct reservations by 68%. Incredibly professional and thoughtful work.",
    image: "https://picsum.photos/id/1011/64/64"
  },
  {
    name: "Vikram Malhotra",
    role: "Director",
    company: "Serenity Hotels & Resorts",
    quote: "Working with SHIV felt like having an in-house product team. The admin dashboard and guest experience flows are world-class. Our team loves using it every day.",
    image: "https://picsum.photos/id/1005/64/64"
  },
  {
    name: "Dr. Priya Sharma",
    role: "CEO",
    company: "Island Wellness Retreats",
    quote: "The level of detail and polish in every interaction is unmatched. Our new CRM has streamlined operations across three properties. Truly premium craftsmanship.",
    image: "https://picsum.photos/id/1009/64/64"
  },
  {
    name: "Arjun Patel",
    role: "Head of Digital",
    company: "Bluewater Activities",
    quote: "From concept to launch in under 7 weeks. The 3D elements and smooth animations on our activity booking platform blew our stakeholders away. Exceptional.",
    image: "https://picsum.photos/id/201/64/64"
  },
];

export default function TestimonialMarquee() {
  // Duplicate for seamless loop
  const allTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div className="testimonial-track flex gap-6">
        {allTestimonials.map((t, index) => (
          <div 
            key={index}
            className="premium-card min-w-[380px] max-w-[380px] p-8 flex-shrink-0"
          >
            <div className="flex items-center gap-4 mb-6">
              <img 
                src={t.image} 
                alt={t.name} 
                className="w-11 h-11 rounded-full object-cover ring-1 ring-black/10" 
              />
              <div>
                <div className="font-semibold tracking-tight">{t.name}</div>
                <div className="text-xs text-black/50">{t.role} at {t.company}</div>
              </div>
            </div>
            <blockquote className="text-[15px] leading-relaxed text-black/70">
              “{t.quote}”
            </blockquote>
          </div>
        ))}
      </div>
    </div>
  );
}
