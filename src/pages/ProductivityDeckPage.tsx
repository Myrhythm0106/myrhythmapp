import { useState, useEffect, useCallback, useRef } from "react";
import { ProductivityInvestorSlides } from "@/components/investor/ProductivityInvestorSlides";
import { ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react";

const TOTAL_SLIDES = 18;

export default function ProductivityDeckPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  const next = useCallback(() => setCurrentSlide((s) => Math.min(s + 1, TOTAL_SLIDES - 1)), []);
  const prev = useCallback(() => setCurrentSlide((s) => Math.max(s - 1, 0)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "Escape" && isFullscreen) document.exitFullscreen?.();
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        if (!document.fullscreenElement) containerRef.current?.requestFullscreen();
        else document.exitFullscreen();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, isFullscreen]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const { clientWidth: w, clientHeight: h } = containerRef.current;
      setScale(Math.min(w / 1920, h / 1080));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    const resetTimer = () => {
      setShowControls(true);
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setShowControls(false), 3000);
    };
    window.addEventListener("mousemove", resetTimer);
    resetTimer();
    return () => { window.removeEventListener("mousemove", resetTimer); clearTimeout(hideTimer.current); };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  };

  const progress = ((currentSlide + 1) / TOTAL_SLIDES) * 100;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden select-none"
      style={{ background: "#0a0a0f" }}
    >
      <div className="absolute top-0 left-0 right-0 z-50 h-[3px]" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #f97316, #a855f7)",
          }}
        />
      </div>

      <div className="absolute inset-0 z-10 flex">
        <div className="w-1/3 h-full cursor-w-resize" onClick={prev} />
        <div className="w-1/3 h-full" />
        <div className="w-1/3 h-full cursor-e-resize" onClick={next} />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          style={{
            width: 1920,
            height: 1080,
            transform: `scale(${scale})`,
            transformOrigin: "center center",
          }}
        >
          <ProductivityInvestorSlides currentSlide={currentSlide} />
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 z-40 transition-opacity duration-500"
        style={{ opacity: showControls ? 1 : 0 }}
      >
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              disabled={currentSlide === 0}
              className="p-2 rounded-full transition-all disabled:opacity-20"
              style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              disabled={currentSlide === TOTAL_SLIDES - 1}
              className="p-2 rounded-full transition-all disabled:opacity-20"
              style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <span
            className="text-sm font-mono tracking-wider"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            {currentSlide + 1} / {TOTAL_SLIDES}
          </span>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full transition-all"
            style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
