type TechStackBadgeProps = {
  name: string;
  initials: string;
  accent: string;
};

export default function TechStackBadge({
  name,
  initials,
  accent,
}: TechStackBadgeProps) {
  return (
    <div className="group flex items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full ${accent} text-[11px] font-semibold uppercase tracking-[0.2em] text-white`}
      >
        {initials}
      </div>
      <span className="text-sm font-medium tracking-[-0.01em] text-black/80">
        {name}
      </span>
    </div>
  );
}
