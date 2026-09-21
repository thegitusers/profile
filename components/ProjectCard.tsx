"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  longDesc?: string;
  image: string;
  tags: string[];
  liveUrl: string;
  githubUrl?: string;
  category: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    
    setRotateY(x * 8); // Max 8deg tilt
    setRotateX(-y * 8);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.3) }}
      className="project-card group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1400px' }}
    >
      <div 
        className="project-card-inner premium-card overflow-hidden h-full flex flex-col"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        {/* Image / Visual */}
        <div className="relative h-56 bg-zinc-100 overflow-hidden border-b border-black/10">
          <img 
            src={project.image} 
            alt={project.title}
            className="absolute inset-0 w-full h-full object-contain bg-slate-300 transition-all duration-700 group-hover:scale-[1.08]"
            loading="lazy"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/30" />
          
          {/* Category badge */}
          <div className="absolute top-4 left-4 px-3.5 py-1 text-[10px] tracking-[1.5px] font-medium bg-white/90 backdrop-blur border border-black/10 rounded-full text-black/70">
            {project.category}
          </div>

          {/* Hover overlay with buttons */}
          <div className={`absolute inset-0 flex items-center justify-center gap-3 bg-black/70 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary text-xs px-5 py-2 flex items-center gap-1.5"
              onClick={e => e.stopPropagation()}
            >
              VISIT LIVE <ArrowUpRight size={14} />
            </a>
            {project.githubUrl && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary text-xs px-4 py-2 border-white/70 text-white hover:bg-white hover:text-black flex items-center gap-1.5"
                onClick={e => e.stopPropagation()}
              >
                <Github size={14} /> CODE
              </a>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-7 flex-1 flex flex-col">
          <h3 className="font-semibold text-2xl tracking-[-1.1px] mb-3 pr-6">{project.title}</h3>
          <p className="text-black/60 text-[15px] leading-snug mb-6 flex-1">{project.description}</p>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {project.tags.slice(0, 4).map((tag, i) => (
              <div 
                key={i} 
                className="px-3 py-px text-[10px] font-medium tracking-wider border border-black/20 rounded-full text-black/60"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
