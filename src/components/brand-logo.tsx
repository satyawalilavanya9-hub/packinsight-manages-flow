import logo from "@/assets/mannat-logo.png";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  tagline?: string;
}

export function BrandLogo({ size = 36, className, showWordmark = false, wordmarkClassName, tagline }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <img
        src={logo}
        alt="Mannat Packaging"
        width={size}
        height={size}
        loading="lazy"
        style={{ width: size, height: size }}
        className="object-contain drop-shadow-sm"
      />
      {showWordmark && (
        <div className="min-w-0">
          <div className={cn("font-semibold tracking-tight leading-none", wordmarkClassName)}>PackInsight</div>
          {tagline && <div className="text-[10px] mt-1 opacity-70 uppercase tracking-widest">{tagline}</div>}
        </div>
      )}
    </div>
  );
}
