export default function Avatar({
  name,
  logoDataUrl,
  size = 32,
}: {
  name: string;
  logoDataUrl?: string | null;
  size?: number;
}) {
  return (
    <span
      style={{ width: size, height: size }}
      className="rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 overflow-hidden text-sm"
    >
      {logoDataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoDataUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        (name || "?").charAt(0).toUpperCase()
      )}
    </span>
  );
}
