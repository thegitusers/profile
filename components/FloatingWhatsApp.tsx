'use client';

import React from 'react';

export default function FloatingWhatsApp() {
  const phoneNumber = "917430809911";
  const message = "Hi Shiv, I'm interested in getting a website made.";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-1.5">
      
      {/* "I'm here" Message */}
      <div className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black shadow-md border border-black/10">
        I'm here
      </div>

      {/* WhatsApp Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-all hover:scale-110 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-white" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.67-.966-.92-1.315-.25-.35-.5-.298-.67-.298-.17 0-.446.074-.67.372-.223.297-.854 1.06-.854 2.59 0 1.53 1.158 3.01 1.323 3.21.166.2 2.286 3.49 5.54 4.89.775.266 1.38.425 1.85.543.777.2 1.48.172 2.038.105.62-.075 1.89-.775 2.16-1.52.27-.746.27-1.386.19-1.52-.08-.135-.3-.223-.62-.372z"/>
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.08L2 22l4.92-1.38A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.4 0-2.72-.36-3.88-1L4 20l1.04-3.92A7.96 7.96 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
        </svg>

        {/* Subtle pulse effect */}
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-25 group-hover:opacity-0"></span>
      </a>
    </div>
  );
}