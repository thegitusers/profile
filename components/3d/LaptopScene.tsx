"use client";

import React from "react";

type LaptopSceneProps = {
  className?: string;
};

export default function Hero({ className = "" }: LaptopSceneProps) {
  return (
    <div className={className}>
      <img
        src="/images/shiv-portrait.png"
        alt="Shiv - Full Stack Developer"
        className="h-auto w-full"
      />
    </div>
  );
}