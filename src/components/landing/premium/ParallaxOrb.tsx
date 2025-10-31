import React, { useEffect, useState } from "react";

interface ParallaxOrbProps {
  color: "emerald" | "teal" | "orange" | "blue";
  size: "sm" | "md" | "lg";
  position: string;
  speed?: number;
}

export function ParallaxOrb({ color, size, position, speed = 0.5 }: ParallaxOrbProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * speed);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  const colorClasses = {
    emerald: "from-brand-emerald-400/20 to-brand-emerald-600/20",
    teal: "from-brand-teal-400/20 to-brand-teal-600/20",
    orange: "from-brand-orange-400/20 to-brand-orange-600/20",
    blue: "from-brand-blue-400/20 to-brand-blue-600/20"
  };

  const sizeClasses = {
    sm: "w-64 h-64",
    md: "w-96 h-96",
    lg: "w-[32rem] h-[32rem]"
  };

  return (
    <div
      className={`absolute ${position} ${sizeClasses[size]} bg-gradient-to-br ${colorClasses[color]} rounded-full blur-3xl pointer-events-none opacity-30`}
      style={{
        transform: `translateY(${offset}px)`
      }}
    />
  );
}
