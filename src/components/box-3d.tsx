import { useEffect, useState } from "react";

interface Box3DProps {
  length: number; // mm
  width: number;
  height: number;
  colors: number; // 0/1/2/4 ink colors
}

/**
 * Pure CSS 3D corrugated box — rotates slowly, resizes as L/W/H changes.
 * No three.js dependency; runs everywhere.
 */
export function Box3D({ length, width, height, colors }: Box3DProps) {
  const [angle, setAngle] = useState(-25);

  useEffect(() => {
    const id = setInterval(() => setAngle((a) => (a + 0.35) % 360), 40);
    return () => clearInterval(id);
  }, []);

  // Scale mm → px, keep max ~180px on longest side
  const maxMm = Math.max(length, width, height, 1);
  const scale = 170 / maxMm;
  const L = length * scale;
  const W = width * scale;
  const H = height * scale;

  // Kraft brown palette, ink adds a printed band
  const kraft = "#c9955a";
  const kraftDark = "#a06f3a";
  const kraftLight = "#e0b280";
  const ink = colors >= 4 ? "#0d7a5f" : colors >= 2 ? "#c9a84c" : colors >= 1 ? "#8b6f4e" : "transparent";

  const face = (bg: string): React.CSSProperties => ({
    position: "absolute",
    background: `linear-gradient(135deg, ${bg} 0%, ${bg} 60%, ${kraftDark} 100%)`,
    border: "1px solid rgba(80, 45, 20, 0.35)",
    boxShadow: "inset 0 0 12px rgba(80, 45, 20, 0.25)",
  });

  // Faint corrugated line pattern
  const corrugation = "repeating-linear-gradient(90deg, transparent 0 3px, rgba(0,0,0,0.06) 3px 4px)";

  return (
    <div className="flex items-center justify-center py-6" style={{ perspective: 900 }}>
      <div
        style={{
          position: "relative",
          width: L,
          height: H,
          transformStyle: "preserve-3d",
          transform: `rotateX(-18deg) rotateY(${angle}deg)`,
          transition: "width 300ms ease, height 300ms ease",
        }}
      >
        {/* Front */}
        <div style={{ ...face(kraft), width: L, height: H, transform: `translateZ(${W / 2}px)`, backgroundImage: corrugation }}>
          {colors > 0 && (
            <div style={{ position: "absolute", top: "38%", left: "10%", right: "10%", height: "18%", background: ink, opacity: 0.85, borderRadius: 2 }} />
          )}
        </div>
        {/* Back */}
        <div style={{ ...face(kraftDark), width: L, height: H, transform: `rotateY(180deg) translateZ(${W / 2}px)`, backgroundImage: corrugation }} />
        {/* Right */}
        <div style={{ ...face(kraftDark), width: W, height: H, left: L / 2 - W / 2, transform: `rotateY(90deg) translateZ(${L / 2}px)` }} />
        {/* Left */}
        <div style={{ ...face(kraft), width: W, height: H, left: L / 2 - W / 2, transform: `rotateY(-90deg) translateZ(${L / 2}px)` }} />
        {/* Top */}
        <div style={{ ...face(kraftLight), width: L, height: W, top: H / 2 - W / 2, transform: `rotateX(90deg) translateZ(${H / 2}px)` }} />
        {/* Bottom */}
        <div style={{ ...face(kraftDark), width: L, height: W, top: H / 2 - W / 2, transform: `rotateX(-90deg) translateZ(${H / 2}px)` }} />
      </div>
    </div>
  );
}
