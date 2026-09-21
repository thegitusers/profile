"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  href?: string;
}

export default function MagneticButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  href 
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Magnetic pull strength
    const strength = 0.35;
    element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const handleMouseLeave = () => {
    const element = ref.current;
    if (element) {
      element.style.transition = 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)';
      element.style.transform = 'translate(0px, 0px)';
      
      setTimeout(() => {
        if (element) element.style.transition = '';
      }, 450);
    }
  };

  const baseClasses = variant === 'primary' ? 'btn btn-primary' : 'btn btn-secondary';

  const Component = href ? 'a' : 'button';

  return (
    <Component
      ref={ref as any}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </Component>
  );
}
