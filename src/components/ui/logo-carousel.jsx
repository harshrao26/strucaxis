"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// ---------- helpers ----------
const shuffleArray = (array) => {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const distributeLogos = (allLogos, columnCount) => {
  const shuffled = shuffleArray(allLogos);
  const columns = Array.from({ length: columnCount }, () => []);
  shuffled.forEach((logo, i) => columns[i % columnCount].push(logo));

  // pad shorter columns so all columns cycle evenly
  const maxLength = Math.max(...columns.map((c) => c.length), 1);
  columns.forEach((c) => {
    while (c.length < maxLength) c.push(shuffled[Math.floor(Math.random() * shuffled.length)]);
  });
  return columns;
};

// turn a URL into a tiny React component so your <CurrentLogo .../> usage still works
const asImgComponent = (src, alt) =>
  function LogoImg(props) {
    return (
      <img
        src={src}
        alt={alt || "client logo"}
        {...props}
        loading="lazy"
        className={`object-contain ${props.className || ""}`}
      />
    );
  };

// ---------- column ----------
const LogoColumn = React.memo(function LogoColumn({ logos, index, currentTime }) {
  const cycleInterval = 2000;
  const columnDelay = index * 200;

  const adjustedTime = (currentTime + columnDelay) % (cycleInterval * logos.length || 1);
  const currentIndex = Math.floor(adjustedTime / cycleInterval) % (logos.length || 1);

  const CurrentLogo = useMemo(() => logos[currentIndex]?.img || (() => null), [logos, currentIndex]);

  return (
    <motion.div
      className="relative h-14 w-24 overflow-hidden md:h-24 md:w-48"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${logos[currentIndex]?.id || "x"}-${currentIndex}`}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ y: "10%", opacity: 0, filter: "blur(8px)" }}
          animate={{
            y: "0%",
            opacity: 1,
            filter: "blur(0px)",
            transition: { type: "spring", stiffness: 300, damping: 20, mass: 1, bounce: 0.2, duration: 0.5 },
          }}
          exit={{ y: "-20%", opacity: 0, filter: "blur(6px)", transition: { type: "tween", ease: "easeIn", duration: 0.3 } }}
        >
          <CurrentLogo className="max-h-[80%] max-w-[80%] h-20 w-20 md:h-32 md:w-32" />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
});

// ---------- main ----------
function LogoCarousel({ columnCount = 6, className = "" }) {
  const [logoSets, setLogoSets] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);

  // fetch logos from backend
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/client-logos?limit=100&sort=order`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to load client logos");
        const items = (json.items || []).filter((l) => l?.image?.src);

        // map to { id, img: Component }
        const all = items.map((l) => ({
          id: l._id || l.name,
          img: asImgComponent(l.image.src, l.image.alt || l.name),
        }));

        if (alive) {
          const distributed = distributeLogos(all.length ? all : [{ id: "placeholder", img: asImgComponent("", "") }], columnCount);
          setLogoSets(distributed);
        }
      } catch (e) {
        console.error("LogoCarousel fetch error:", e);
        if (alive) setLogoSets([[]]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [columnCount]);

  // timer
  const updateTime = useCallback(() => setCurrentTime((t) => t + 100), []);
  useEffect(() => {
    const id = setInterval(updateTime, 100);
    return () => clearInterval(id);
  }, [updateTime]);

  // loading skeleton
  if (loading) {
    return (
      <div className={`flex gap-4 ${className}`}>
        {Array.from({ length: columnCount }).map((_, i) => (
          <div key={i} className="h-14 w-24 animate-pulse rounded-md bg-zinc-200 md:h-24 md:w-48" />
        ))}
      </div>
    );
  }

  if (!logoSets.length) return null;

  return (
    <div className={`flex space-x-4 ${className}`}>
      {logoSets.map((logos, index) => (
        <LogoColumn key={index} logos={logos} index={index} currentTime={currentTime} />
      ))}
    </div>
  );
}

export { LogoCarousel };
export default LogoCarousel;