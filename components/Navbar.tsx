"use client";

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '#process', label: 'Process' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Simple active section detection (can be enhanced with IntersectionObserver)
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id) setActiveSection(id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px -20%' }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition - bodyRect - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-black/10">
      <div className="container flex items-center justify-between h-20">
        {/* Logo */}
        <a 
          href="#hero" 
          onClick={(e) => { e.preventDefault(); scrollToSection('#hero'); }}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center">
            <span className="font-mono text-sm font-semibold tracking-[-1.5px]">S</span>
          </div>
          <div>
            <div className="font-semibold tracking-[-1.2px] text-xl">SHIV</div>
            <div className="text-[10px] text-black/50 -mt-1">FULL STACK DEVELOPER</div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className={`nav-link text-sm transition-colors hover:text-black/70 ${
                activeSection === link.href.slice(1) ? 'active text-black' : 'text-black/60'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <button 
            onClick={() => scrollToSection('#contact')}
            className="btn btn-primary text-sm px-8 py-2.5"
          >
            Hire Me
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 -mr-2"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-black/10 bg-white"
          >
            <div className="container py-8 flex flex-col gap-6 text-lg">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-left py-1 text-black/80 active:text-black"
                >
                  {link.label}
                </button>
              ))}
              <button 
                onClick={() => scrollToSection('#contact')}
                className="btn btn-primary w-full mt-4"
              >
                Start a Project
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
