import React, { useEffect, useRef, useState } from "react";

// --- Custom Hook for smooth counting animation ---
const useCountUp = (endValue, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isIntersecting) return;

    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // easeOutExpo curve for a snappy, premium deceleration
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(endValue * ease);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isIntersecting, endValue, duration]);

  return { ref, count };
};

// --- Animated Number Component ---
const AnimatedStat = ({ value, prefix = "", suffix = "", decimals = 0, label, displayValue }) => {
  const { ref, count } = useCountUp(value, 2000);

  const formattedCount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(count);

  return (
    <div
      ref={ref}
      // Vercel/Linear style: stark background, subtle hover state, left-aligned
      className="group relative flex flex-col justify-center bg-black p-8 transition-colors duration-500 hover:bg-zinc-900/40 md:p-10"
    >
      <div className="flex items-baseline gap-1">
        {prefix && (
          <span className="text-2xl font-medium text-zinc-500 md:text-3xl">
            {prefix}
          </span>
        )}
        {/* Tight tracking and sans font for that Inter/Geist look */}
        <span className="text-4xl font-semibold tracking-tighter text-white md:text-5xl lg:text-6xl">
          {displayValue ?? formattedCount}
        </span>
        {suffix && (
          <span className="text-2xl font-medium text-zinc-500 md:text-3xl">
            {suffix}
          </span>
        )}
      </div>
      
      {/* Simple, sentence-case label. No loud uppercase letters. */}
      <p className="mt-2 text-sm font-medium text-zinc-500 md:text-base">
        {label}
      </p>
    </div>
  );
};

// --- Main Trust Section ---
export default function TrustSection() {
  const stats = [
    { label: "Challenge account size", value: 200, prefix: "$", suffix: "K", decimals: 0 },
    { label: "Maximum performance reward", value: 90, suffix: "%", decimals: 0 },
    { label: "Choose your challenge", value: 1, displayValue: "1 or 2", decimals: 0 },
    { label: "Try ACG before you buy", value: 0, displayValue: "FREE", decimals: 0 },
  ];

  return (
    // Pure black background, zero gradients.
    <section className="flex min-h-[60vh] w-full items-center justify-center bg-black px-6 py-24 font-sans">
      <div className="mx-auto w-full max-w-6xl">
        
        {/* Header - Left Aligned, High Contrast */}
        <div className="mb-12 flex flex-col md:mb-16">
          <h2 className="text-3xl font-medium tracking-tighter text-zinc-100 sm:text-4xl md:text-5xl">
            Trusted by traders worldwide.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-zinc-400 md:text-lg">
            We provide the infrastructure and capital. You bring the edge. Join the proprietary trading firm built for modern professionals.
          </p>
        </div>

        {/* 
          The "1px Grid" Trick:
          By using a container with a zinc-800 background and a 1px gap, 
          we create perfect, non-overlapping 1px borders between the items.
        */}
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-800">
          <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <AnimatedStat 
                key={index}
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                decimals={stat.decimals}
                label={stat.label}
                displayValue={stat.displayValue}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}