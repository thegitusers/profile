"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CursorFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    const moveHandler = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const downHandler = () => setIsActive(true);
    const upHandler = () => setIsActive(false);

    // Magnetic elements detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('.btn') ||
        target.closest('.premium-card') ||
        target.closest('input') ||
        target.closest('textarea')
      ) {
        setIsActive(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('.btn') ||
        target.closest('.premium-card')
      ) {
        setIsActive(false);
      }
    };

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mousedown', downHandler);
    window.addEventListener('mouseup', upHandler);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mousedown', downHandler);
      window.removeEventListener('mouseup', upHandler);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className={`cursor ${isActive ? 'active' : ''}`}
      animate={{
        x: position.x - 12,
        y: position.y - 12,
      }}
      transition={{
        type: "spring",
        stiffness: 450,
        damping: 28,
        mass: 0.5,
      }}
    />
  );
}
