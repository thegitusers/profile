"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Users,
  Zap,
  Award,
  Code2,
  Palette,
  Rocket,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import Lenis from "lenis";

// Components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LaptopScene from "@/components/3d/LaptopScene";
import EnvelopeScene from "@/components/3d/EnvelopeScene";
import ProjectCard from "@/components/ProjectCard";
import ProcessTimeline from "@/components/ProcessTimeline";
import StatsCounter from "@/components/StatsCounter";
import TestimonialMarquee from "@/components/TestimonialMarquee";
import MagneticButton from "@/components/MagneticButton";
import CursorFollower from "@/components/CursorFollower";
import Honeypot from "@/components/Honeypot";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

// Types
interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl: string;
  githubUrl?: string;
  category: string;
}

interface FormData {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  company_site: string;
}

// Data
const projectsData = [
  {
    title: "Think n Maker",
    img: "https://www.thinknmaker.com/theme_2/pix.png",
    description: "Travel And Tourism Booking Platform",
    link: "https://www.thinknmaker.com/",
    category: "Tourism",
    tech: ["php", "slim", "mysql"],
  },
  {
    title: "Andaman Star Gazing",
    img: "https://cdn.creativefabrica.com/2022/01/06/silhouette-telescope-astronomy-logo-Graphics-23054823-1.jpg",
    description: "Stargazing and astronomy platform",
    link: "https://stargazing-smoky.vercel.app/",
    category: "Activities",
    tech: ["next.js", "react", "tailwind"],
  },
  {
    title: "Web Roast",
    img: "#",
    description: "Website review platform for businesses",
    link: "https://web-roast-snowy.vercel.app/",
    category: "Website Review",
    tech: ["html", "js", "tailwind"],
  },
  {
    title: "Andaman Akash",
    img: "https://andamanakash.com/themes-2/images/logo.png",
    description: "Tourism & travel booking",
    link: "https://andamanakash.com/",
    category: "Tourism",
    tech: ["php", "slim", "mysql"],
  },
  {
    title: "Andaman Bliss",
    img: "https://andamanbliss.com/site/img/logo.png",
    description: "travel agency management system",
    link: "https://andamanbliss.com/",
    category: "Tourism",
    tech: ["Laravel", "CRM", "API Integration"],
  },
  {
    title: "Island Wonders",
    img: "https://islandswonder.com/assets/img/home/900ba028c5d27653.png",
    description: "Island attractions platform",
    link: "https://islandswonder.com/",
    category: "Tourism",
    tech: ["Slim3", "PHP", "MySQL"],
  },
  {
    title: "MCM Building Solutions",
    img: null,
    description: "Enterprise inventory management",
    link: "#",
    category: "Enterprise",
    tech: ["laravel", "CRM"],
  },
  {
    title: "Andaman Ticket Hub",
    img: "https://andamantickethub.com/storage/company_logos/BGJ5CYf6Jkz4GXurR3qQRfFA0XjT3F8Edpo9EKu1.png",
    link: "https://andamantickethub.com/",
    description: "Ticketing system for attractions",
    category: "Tourism",
    tech: ["Next.js", "Laravel"],
  },
  {
    title: "Andaman Diya Tours & Travels",
    link: "https://andamandiyatoursandtravels.com/",
    img: "https://andamandiyatoursandtravels.com/storage/company_logos/1P8PeoHPuyRMyToOkJVIt1SydbSEG1DWgD5AGuIA.jpg",
    description: "Travel and accommodation booking platform",
    tech: ["Laravel", "MySQL"],
    category: "Travel",
  },
];

const projects: Project[] = projectsData.map((project, index) => ({
  id: index + 1,
  title: project.title,
  description: project.description,
  image:
    project.img && project.img !== "#"
      ? project.img
      : "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
  tags: project.tech.map((tech) =>
    tech.replace(/\b\w/g, (char) => char.toUpperCase()),
  ),
  liveUrl: project.link && project.link !== "#" ? project.link : "#",
  category: project.category,
}));

const services = [
  {
    icon: Code2,
    title: "Web Development",
    desc: "Bespoke, high-performance websites and web applications built with Next.js, Laravel, and modern best practices.",
  },
  {
    icon: Users,
    title: "Custom CRM Development",
    desc: "Tailored business management systems that perfectly match your unique workflows and team structure.",
  },
  {
    icon: Calendar,
    title: "Booking & Reservation Systems",
    desc: "Complex travel, hotel, activity, and resource booking platforms with real-time inventory and payments.",
  },
  {
    icon: Palette,
    title: "Admin Panels & Dashboards",
    desc: "Powerful, intuitive internal tools with analytics, reporting, and beautiful data visualizations.",
  },
  {
    icon: Zap,
    title: "API Development & Integration",
    desc: "Secure, well-documented REST & GraphQL APIs. Third-party integrations done right.",
  },
  {
    icon: Shield,
    title: "SEO & Performance Optimization",
    desc: "Lightning-fast, search-optimized websites that rank and convert. Core Web Vitals excellence.",
  },
  {
    icon: Rocket,
    title: "Website Maintenance & Support",
    desc: "Ongoing care, security updates, feature iterations, and priority support for your digital product.",
  },
];

const techStack = [
  { name: "Laravel", initials: "LA", accent: "bg-[#ff2d20]" },
  { name: "PHP", initials: "PH", accent: "bg-[#777bb4]" },
  { name: "React", initials: "RE", accent: "bg-[#61dafb]" },
  { name: "Next.js", initials: "NX", accent: "bg-[#000000]" },
  { name: "TypeScript", initials: "TS", accent: "bg-[#3178c6]" },
  { name: "Tailwind", initials: "TW", accent: "bg-[#06b6d4]" },
  { name: "MySQL", initials: "MS", accent: "bg-[#00758f]" },
  { name: "Node.js", initials: "ND", accent: "bg-[#339933]" },
  { name: "GitHub", initials: "GH", accent: "bg-[#181717]" },
  { name: "Livewire", initials: "LW", accent: "bg-[#4f46e5]" },
  { name: "Three.js", initials: "3D", accent: "bg-[#111111]" },
  { name: "Framer", initials: "FM", accent: "bg-[#0055ff]" },
];

const whyHireFeatures = [
  "Fast turnaround without compromising quality",
  "Pixel-perfect responsive experiences",
  "Clean, maintainable, well-documented code",
  "SEO-first architecture & performance obsession",
  "Transparent communication & weekly demos",
  "Lifetime support & knowledge transfer",
];

export default function PremiumPortfolio() {
  // Form State
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    projectType: "",
    budget: "",
    message: "",
    company_site: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const keys = ["L", "O", "A", "D", "I", "N", "G"];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % keys.length);
    }, 200);
    return () => clearInterval(interval);
  }, [keys.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1400);
    return () => clearTimeout(timer);
  }, []);
  // Scroll Progress
  const [scrollProgress, setScrollProgress] = useState(0);

  // Lenis Smooth Scroll + GSAP integration
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.8,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Scroll progress bar
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Optional: Sync with GSAP ScrollTrigger if you import gsap
    // gsap.registerPlugin(ScrollTrigger);
    // lenis.on('scroll', ScrollTrigger.update);
    // gsap.ticker.add((time) => lenis.raf(time * 1000));

    return () => {
      lenis.destroy();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Form Handlers
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill out name, email, and message fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      toast.success(
        "Thank you! Your project inquiry has been received. I'll reply within 24 hours.",
        {
          description: "Looking forward to learning more about your vision.",
          duration: 6000,
        },
      );

      setFormData({
        name: "",
        email: "",
        projectType: "",
        budget: "",
        message: "",
        company_site: "",
      });
    } catch (error) {
      console.error(error);
      toast.error(
        "Sorry, your message could not be sent right now. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Magnetic buttons already handle their own, but we can use for primary CTAs

  if (showLoader) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex gap-3" style={{ perspective: "800px" }}>
          {keys.map((key, index) => (
            <div
              key={index}
              className={`w-11 h-11 sm:w-15 sm:h-15 bg-white rounded-sm flex items-center justify-center font-bold text-sm sm:text-xl transition-all duration-150 ${
                index === activeIndex
                  ? "translate-y-1.5 scale-96 text-gray-500 border-1 border-black"
                  : "text-slate-700"
              }`}
              style={{
                boxShadow:
                  index === activeIndex
                    ? "0 1px 0 #020617, 0 4px 10px rgba(0,0,0,0.5)"
                    : "0 6px 0 #020617, 0 10px 20px rgba(0,0,0,0.6)",
              }}
            >
              {key}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white overflow-x-hidden">
      <CursorFollower />

      {/* Scroll Progress Indicator */}
      <div
        className="scroll-progress fixed top-0 left-0 z-[100] h-px bg-black"
        style={{ width: `${scrollProgress}%` }}
      />

      <Navbar />

      {/* ==================== HERO ==================== */}
      <section
        id="hero"
        className="relative flex min-h-screen items-center border-b border-black/10 pt-24 lg:pt-28"
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="max-w-2xl">
                <div className="mb-8 inline-flex items-center rounded-full border border-black/10 px-4 py-2 text-[11px] font-medium tracking-[0.25em] text-black/50">
                  FREELANCE FULL STACK DEVELOPER — ANDAMAN ISLANDS
                </div>

                <h1 className="text-[clamp(3.5rem,10vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.05em]">
                  Hi, I&apos;m
                  <br />
                  SHIV.
                </h1>

                <p className="mt-7 max-w-xl text-[clamp(1rem,2vw,1.5rem)] leading-relaxed text-black/70">
                  I build modern websites, web applications and digital
                  experiences that help businesses grow online.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <MagneticButton
                    onClick={() =>
                      document.getElementById("contact")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      })
                    }
                    variant="primary"
                    className="group w-full justify-center px-8 py-4 text-base sm:w-auto"
                  >
                    Hire Me
                    <ArrowRight
                      size={18}
                      className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </MagneticButton>

                  <MagneticButton
                    onClick={() =>
                      document.getElementById("work")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      })
                    }
                    variant="secondary"
                    className="w-full justify-center px-8 py-4 text-base sm:w-auto"
                  >
                    View Projects
                  </MagneticButton>
                </div>

                <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-[11px] font-medium tracking-[0.25em] text-black/40">
                  <div>
                    <span className="text-black">20+</span> PROJECTS
                  </div>
                  <div>
                    <span className="text-black">14</span> COUNTRIES
                  </div>
                  <div>
                    <span className="text-black">99%</span> SATISFACTION
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex lg:col-span-5 items-stretch justify-center">
              <LaptopScene className="h-full w-full xl:h-[600px]" />
            </div>
          </div>

          <div className="mt-16 border-t  border-black/10 pt-6">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-[10px] font-medium tracking-[0.25em] text-black/40 sm:text-xs">
              <div>ANDAMAN EXPLORER</div>
              <div>SERENITY HOTELS</div>
              <div>BLUEWATER ACTIVITIES</div>
              <div>ISLAND WELLNESS</div>
              <div>CLEANISLE</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ABOUT ==================== */}
      <section id="about" className="section border-b border-black/10">
        <div className="container">
          <div className="grid md:grid-cols-12 gap-x-12 items-start">
            <div className="md:col-span-5 mb-10 md:mb-0">
              <div className="sticky top-24">
                <div className="uppercase tracking-[3px] text-xs text-black/40 mb-3">
                  CHAPTER 01 — THE STORY
                </div>
                <h2 className="section-title">
                  Turning Ideas Into
                  <br />
                  Digital Products
                </h2>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="max-w-[52ch] text-[17px] leading-relaxed text-black/70 mb-10">
                I&apos;m a freelance full stack developer who specializes in
                building modern, high-performance websites and custom web
                applications. With a focus on clean architecture, delightful
                interactions, and measurable business results, I partner with
                ambitious founders and teams across travel, hospitality, and
                service industries.
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  "Laravel",
                  "Next.js",
                  "React",
                  "PHP",
                  "MySQL",
                  "Tailwind CSS",
                  "REST APIs",
                  "Responsive Design",
                ].map((tech, i) => (
                  <div
                    key={i}
                    className="premium-card px-5 py-4 text-sm flex items-center gap-3 border-black/10"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-black" /> {tech}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SERVICES ==================== */}
      <section
        id="services"
        className="section border-b border-black/10 bg-zinc-50/30"
      >
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="uppercase tracking-[3px] text-xs text-black/40 mb-2">
                WHAT I OFFER
              </div>
              <h2 className="section-title">Services</h2>
            </div>
            <p className="hidden md:block max-w-[320px] text-sm text-black/50">
              End-to-end digital product development with a focus on quality,
              speed, and long-term partnership.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -3 }}
                  className="premium-card p-8 group flex flex-col h-full"
                >
                  <div className="mb-8">
                    <div className="w-11 h-11 rounded-2xl border border-black/10 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-semibold text-2xl tracking-[-0.7px] mb-4 pr-4">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-[15px] text-black/60 leading-snug mt-auto">
                    {service.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 ">
            {/* Header */}
           
            <div className="flex justify-between items-end mb-12">
            <div>
              <div className="uppercase tracking-[3px] text-xs text-black/40 mb-2">
                 INTEGRATION EXPERTISE
              </div>
              <h2 className="section-title">API Integrations</h2>
            </div>
            <p className="hidden md:block max-w-[320px] text-sm text-black/50">
             I connect your platform with the tools and services that matter
                most.
            </p>
          </div>
            

            {/* Integrations Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Razorpay */}
              <div className="group rounded-2xl border border-black/10 p-5 hover:border-black/20 transition-all hover:shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                    R
                  </div>
                  <div>
                    <div className="font-semibold">Razorpay</div>
                    <div className="text-xs text-black/50">Payment Gateway</div>
                  </div>
                </div>
                <p className="text-sm text-black/70">
                  Secure payments, UPI, cards & net banking integration
                </p>
              </div>

              {/* Bandhan Bank */}
              <div className="group rounded-2xl border border-black/10 p-5 hover:border-black/20 transition-all hover:shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#003087] flex items-center justify-center text-white text-xs font-bold">
                    BB
                  </div>
                  <div>
                    <div className="font-semibold">Bandhan Bank</div>
                    <div className="text-xs text-black/50">
                      Banking Integration
                    </div>
                  </div>
                </div>
                <p className="text-sm text-black/70">
                  Direct bank transfers and financial API integration
                </p>
              </div>

              {/* Travelbotique */}
              <div className="group rounded-2xl border border-black/10 p-5 hover:border-black/20 transition-all hover:shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                    T
                  </div>
                  <div>
                    <div className="font-semibold">Travelbotique</div>
                    <div className="text-xs text-black/50">Hotel API</div>
                  </div>
                </div>
                <p className="text-sm text-black/70">
                  Real-time hotel inventory and booking synchronization
                </p>
              </div>

              {/* Makruzz */}
              <div className="group rounded-2xl border border-black/10 p-5 hover:border-black/20 transition-all hover:shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white text-xs font-bold">
                    M
                  </div>
                  <div>
                    <div className="font-semibold">Makruzz</div>
                    <div className="text-xs text-black/50">Ferry Booking</div>
                  </div>
                </div>
                <p className="text-sm text-black/70">
                  Andaman ferry ticket integration & availability
                </p>
              </div>

              {/* Nautika */}
              <div className="group rounded-2xl border border-black/10 p-5 hover:border-black/20 transition-all hover:shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-600 flex items-center justify-center text-white text-xs font-bold">
                    N
                  </div>
                  <div>
                    <div className="font-semibold">Nautika</div>
                    <div className="text-xs text-black/50">Ferry API</div>
                  </div>
                </div>
                <p className="text-sm text-black/70">
                  Live ferry schedules and seat booking system
                </p>
              </div>

              {/* Green Ocean */}
              <div className="group rounded-2xl border border-black/10 p-5 hover:border-black/20 transition-all hover:shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white text-xs font-bold">
                    GO
                  </div>
                  <div>
                    <div className="font-semibold">Green Ocean</div>
                    <div className="text-xs text-black/50">Ferry Services</div>
                  </div>
                </div>
                <p className="text-sm text-black/70">
                  Seamless ferry booking and management integration
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TECH STACK MARQUEE ==================== */}
      <section className="overflow-hidden border-b border-black/10 py-16">
        <div className="container mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 uppercase tracking-[3px] text-xs text-black/40">
              TECH STACK
            </div>
            <h2 className="section-title">Tools I Use</h2>
          </div>
          <p className="max-w-[34ch] text-sm text-black/55">
            A modern stack for building fast, scalable, and polished digital
            products.
          </p>
        </div>

        <div className="marquee border-y border-black/10 bg-black py-5">
          <div className="marquee-inner flex items-center gap-4 pr-4 text-white/80">
            {[...techStack, ...techStack].map((tech, index) => (
              <div
                key={`${tech.name}-${index}`}
                className=" px-4 py-2 backdrop-blur-sm"
              >
                <span className="text-[12px] font-medium uppercase tracking-[0.2em]">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PROJECTS ==================== */}
      <section id="work" className="section border-b border-black/10">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="uppercase tracking-[3px] text-xs text-black/40 mb-2">
                SELECTED WORK
              </div>
              <h2 className="section-title">Featured Projects</h2>
            </div>
            <p className="max-w-[38ch] text-black/50 text-[15px]">
              A selection of recent work spanning travel tech, hospitality
              platforms, and custom business tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          <div className="text-center mt-14">
            <a
              href="https://github.com"
              target="_blank"
              className="inline-flex items-center gap-2 text-sm tracking-wider border-b border-black/30 pb-px hover:border-black transition-colors"
            >
              VIEW ALL PROJECTS ON GITHUB <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ==================== PROCESS ==================== */}
      <section id="process" className="section border-b border-black/10">
        <div className="container max-w-5xl">
          <div className="text-center mb-14">
            <div className="uppercase tracking-[3px] text-xs text-black/40 mb-3">
              HOW WE WORK TOGETHER
            </div>
            <h2 className="section-title">
              A clear, collaborative
              <br />
              process from day one.
            </h2>
          </div>

          <ProcessTimeline />
        </div>
      </section>

      {/* ==================== WHY HIRE ME ==================== */}
      <section className="section border-b border-black/10 bg-zinc-50/40">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-x-12 gap-y-12 items-start">
            <div className="lg:col-span-5">
              <div className="sticky top-24">
                <div className="uppercase tracking-[3px] text-xs text-black/40 mb-3">
                  WHY CLIENTS CHOOSE ME
                </div>
                <h2 className="section-title tracking-[-1.5px]">
                  Results-driven.
                  <br />
                  Detail-obsessed.
                  <br />
                  Partner-first.
                </h2>
                <p className="mt-6 text-black/60 max-w-[38ch]">
                  I don&apos;t just deliver code — I deliver outcomes. Every
                  project is treated like it&apos;s my own product.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-10">
              <StatsCounter />

              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 pt-4">
                {whyHireFeatures.map((feature, i) => (
                  <div key={i} className="flex gap-3 text-[15px]">
                    <div className="mt-1.5 text-black/40">→</div>
                    <div>{feature}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="section border-b border-black/10 overflow-hidden">
        <div className="container mb-10">
          <div className="flex items-end justify-between">
            <div>
              <div className="uppercase tracking-[3px] text-xs text-black/40 mb-2">
                REAL RESULTS FROM REAL CLIENTS
              </div>
              <h2 className="section-title">Kind words.</h2>
            </div>
          </div>
        </div>

        <TestimonialMarquee />
      </section>

      {/* ==================== CONTACT ==================== */}
      <section id="contact" className="section bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-x-16 gap-y-16">
            {/* Left: Form */}
            <div className="lg:col-span-7">
              <div className="max-w-xl">
                <div className="uppercase tracking-[3px] text-xs text-black/40 mb-4">
                  LET&apos;S CREATE SOMETHING EXCEPTIONAL
                </div>
                <h2 className="section-title tracking-[-1.8px] mb-4">
                  Ready to build
                  <br />
                  your next big thing?
                </h2>
                <p className="text-lg text-black/60 mb-10">
                  Tell me about your project. I&apos;ll get back to you within
                  24 hours with thoughts, timeline, and next steps.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
                <Honeypot
                  value={formData.company_site}
                  onChange={(v) => setFormData((prev) => ({ ...prev, company_site: v }))}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs tracking-wider text-black/50 mb-1.5 pl-1">
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Alex Rivera"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider text-black/50 mb-1.5 pl-1">
                      WORK EMAIL
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs tracking-wider text-black/50 mb-1.5 pl-1">
                      PROJECT TYPE
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="form-input text-black/70"
                    >
                      <option value="">Select type...</option>
                      <option value="travel-booking">
                        Travel / Hotel Booking Platform
                      </option>
                      <option value="custom-crm">Custom CRM / Dashboard</option>
                      <option value="admin-panel">Internal Admin Tool</option>
                      <option value="marketing-site">
                        Marketing / Brand Website
                      </option>
                      <option value="other">Other / Custom Project</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider text-black/50 mb-1.5 pl-1">
                      ESTIMATED BUDGET
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="form-input text-black/70"
                    >
                      <option value="">Select range...</option>
                      <option value="10-25k">₹10K – ₹25K</option>
                      <option value="25-45k">₹25K – ₹45K</option>
                      <option value="45-80k">₹45K – ₹80K</option>
                      <option value="80k+">₹80K+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-wider text-black/50 mb-1.5 pl-1">
                    PROJECT DETAILS &amp; GOALS
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="form-input resize-y min-h-[138px]"
                    placeholder="Tell me about your vision, timeline, current tech stack, or any specific challenges you're facing..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full sm:w-auto mt-4 text-base py-4 px-14 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "SENDING YOUR INQUIRY..." : "START PROJECT →"}
                </button>

                <p className="text-[11px] text-black/40 pl-1">
                  I typically respond within a few hours during business days.
                </p>
              </form>
            </div>

            {/* Right: 3D Envelope + Contact Info */}
            <div className="lg:col-span-5">
              <div className="sticky top-24">
                <EnvelopeScene className="mb-10" />

                <div className="space-y-8 text-sm">
                  <div>
                    <div className="text-black/40 text-xs tracking-widest mb-2">
                      DIRECT
                    </div>
                    <a
                      href="mailto:shivakumar28226@gmail.com"
                      className="block text-xl tracking-tight hover:underline"
                    >
                      shivakumar28226@gmail.com
                    </a>
                  </div>
                  <div>
                    <div className="text-black/40 text-xs tracking-widest mb-2">
                      WHATSAPP / CALL
                    </div>
                    <a
                      href="https://wa.me/917430809911"
                      target="_blank"
                      className="block text-xl tracking-tight hover:underline"
                    >
                      +91 74308 09911
                    </a>
                  </div>
                  <div>
                    <div className="text-black/40 text-xs tracking-widest mb-2">
                      BASED IN
                    </div>
                    <div className="text-xl tracking-tight">
                      Port Blair, Andaman &amp; Nicobar Islands, India
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}
