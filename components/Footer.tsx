"use client";

import React from 'react';
import { Github, Linkedin, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="container py-16">
        <div className="flex flex-col md:flex-row justify-between gap-y-12">
          {/* Logo & Tagline */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full border border-black flex items-center justify-center">
                <span className="font-mono text-lg font-semibold tracking-[-2px]">S</span>
              </div>
              <div className="font-semibold text-2xl tracking-[-1.5px]">SHIV</div>
            </div>
            <p className="text-sm text-black/50 max-w-[220px]">
              Crafting premium digital experiences.<br />Based in the Andaman Islands, India.
            </p>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-16 gap-y-8 text-sm">
            <div>
              <div className="font-medium mb-4 text-black/60">Explore</div>
              <div className="space-y-2.5 text-black/70">
                <a href="#about" className="block hover:text-black transition-colors">About</a>
                <a href="#services" className="block hover:text-black transition-colors">Services</a>
                <a href="#work" className="block hover:text-black transition-colors">Featured Work</a>
              </div>
            </div>
            <div>
              <div className="font-medium mb-4 text-black/60">Connect</div>
              <div className="space-y-2.5 text-black/70">
                <a href="https://www.linkedin.com/in/shiva-kumar-7n/" target="_blank" rel="noopener noreferrer" className="block hover:text-black transition-colors">LinkedIn</a>
                <a href="https://github.com/shivakumar202" target="_blank" rel="noopener noreferrer" className="block hover:text-black transition-colors">GitHub</a>
                <a href="https://www.instagram.com/_7ncognito?igsh=NHVqdWlzcGxua3Vh" target="_blank" rel="noopener noreferrer" className="block hover:text-black transition-colors">Instagram</a>
              </div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="font-medium mb-4 text-black/60">Get in Touch</div>
              <a 
                href="mailto:shivakumar28226@gmail.com" 
                className="text-black/70 hover:text-black transition-colors block mb-1"
              >
                shivakumar28226@gmail.com
              </a>
              <a 
                href="https://wa.me/917430809911" 
                target="_blank"
                className="text-black/70 hover:text-black transition-colors block"
              >
                +91 74308 09911
              </a>
              <div className="text-xs text-black/40 mt-6">Available for select projects in 2026</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-black/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-black/40">
          <div>© {currentYear} SHIV. All rights reserved.</div>
          <div className="flex items-center gap-5">
            <span>Privacy</span>
            <span>Legal</span>
            <span>ShivWebs</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/shivakumar202" target="_blank" rel="noopener" className="hover:text-black transition-colors"><Github size={16} /></a>
            <a href="https://www.linkedin.com/in/shiva-kumar-7n/" target="_blank" rel="noopener" className="hover:text-black transition-colors"><Linkedin size={16} /></a>
            <a href="https://www.instagram.com/_7ncognito?igsh=NHVqdWlzcGxua3Vh" target="_blank" rel="noopener" className="hover:text-black transition-colors"><Instagram size={16} /></a>
            <a href="mailto:shivakumar28226@gmail.com" className="hover:text-black transition-colors"><Mail size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
