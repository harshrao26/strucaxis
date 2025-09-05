"use client";

import { useEffect, useRef, useState } from "react";

// Hook to detect when an element enters the viewport
function useInViewOnce(options = { root: null, rootMargin: "0px", threshold: 0.3 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (!ref.current || seen) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      });
    }, options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [seen, options]);

  return { ref, inViewOnce: seen };
}

// Hook to animate number count-up
function useCountUp(target, start, duration = 1500) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    if (!start) return;

    const step = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
    return () => {
      startRef.current = null;
    };
  }, [start, target, duration]);

  return value;
}

// Component for a single stat
function Stat({ value, suffix, label }) {
  const { ref, inViewOnce } = useInViewOnce();
  const display = useCountUp(value, inViewOnce);

  return (
    <div ref={ref} className="text-center flex flex-col items-center justify-center">
      <div className="text-2xl sm:text-5xl  font-medium tracking-tight text-[#101010]">
        {display}
        {suffix && <span className="ml-1 font-medium">{suffix}</span>}
      </div>
      <div className="mt-1 text-sm md:w-full w-20 text-center text-neutral-500">{label}</div>
    </div>
  );
}

// Stats Section
export default function Stats() {
  return (
    <section className="bg-white md:my-20">
      <div className="max-w-7xl mx-auto px-5 py-4 sm:py-8">
        <div className="grid grid-cols-3 md:grid-cols-3 gap-y-10 pt-2 sm:gap-y-12">
          <Stat value={9} suffix="+" label="Years" />
          {/* <Stat value={20} suffix="+" label="Projects" /> */}
          <Stat value={1000} suffix="+" label="Projects" />
          <Stat value={50} suffix="+" label="Locations" />
        </div>
      </div>
    </section>
  );
}