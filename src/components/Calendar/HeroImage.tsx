import React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./Calendar.module.css";
import type { MonthJourneyTheme } from "@/data/monthJourneyThemes";
import type { MonthTheme } from "@/data/monthImages";

const MONTH_MESSAGES = [
  {
    title: "Reset Mode",
    quote: "New year doesn't matter. New habits do.",
  },
  {
    title: "Foundation Month",
    quote: "You're not behind. You're just not consistent yet.",
  },
  {
    title: "Discipline Phase",
    quote: "Motivation dies. Discipline stays.",
  },
  {
    title: "Grind Mode",
    quote: "1 question today > 0 perfect plans.",
  },
  {
    title: "Pressure Build",
    quote: "Now it starts getting uncomfortable. Good.",
  },
  {
    title: "Pre-Placement Mode",
    quote: "You don't rise to the level of goals. You fall to your habits.",
  },
  {
    title: "Placement Season",
    quote: "This is what you prepared for.",
  },
  {
    title: "Peak Pressure",
    quote: "Stay calm. Most people panic here.",
  },
  {
    title: "Conversion Phase",
    quote: "Opportunities come to those still consistent.",
  },
  {
    title: "Growth Mode",
    quote: "Don't stop just because you got one win.",
  },
  {
    title: "Expansion Phase",
    quote: "Now build what you couldn't before.",
  },
  {
    title: "Reflection Mode",
    quote: "Look back. You're not the same person.",
  },
];

const MONTH_ICON_PATHS: Record<MonthJourneyTheme["icon"], string[]> = {
  spark: ["M12 2v5", "M12 17v5", "M4.22 4.22l3.54 3.54", "M16.24 16.24l3.54 3.54", "M2 12h5", "M17 12h5", "M4.22 19.78l3.54-3.54", "M16.24 7.76l3.54-3.54"],
  base: ["M4 20h16", "M6 16h12", "M8 12h8", "M10 8h4", "M12 4v4"],
  shield: ["M12 3 5 6v6c0 4 2.8 7.5 7 9 4.2-1.5 7-5 7-9V6l-7-3Z", "M9 12l2 2 4-5"],
  flame: ["M12 22c3.3-1.2 5-3.6 5-6.4 0-2.3-1.4-4.1-3.1-5.7-.6 2-1.8 3-3.4 4.1.4-3.1-.7-5.6-3.1-8C6.3 8.8 5 11 5 15.1 5 18.8 7.7 21.1 12 22Z"],
  pressure: ["M12 2v4", "M12 18v4", "M4.9 4.9l2.8 2.8", "M16.3 16.3l2.8 2.8", "M2 12h4", "M18 12h4", "M7.7 16.3l-2.8 2.8", "M19.1 4.9l-2.8 2.8", "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"],
  target: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z", "M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"],
  bolt: ["M13 2 4 14h7l-1 8 10-13h-7l1-7Z"],
  calm: ["M4 15c2-3 4-3 6 0s4 3 6 0 3-3 4-1", "M4 9c2-3 4-3 6 0s4 3 6 0 3-3 4-1"],
  convert: ["M7 7h10v10", "M17 7 7 17", "M5 5h6", "M13 19h6"],
  growth: ["M4 20c7-1 12-6 16-16", "M7 15c0-4 2-7 6-8", "M13 7h6v6"],
  expand: ["M8 3H3v5", "M16 3h5v5", "M8 21H3v-5", "M16 21h5v-5", "M3 3l7 7", "M21 3l-7 7", "M3 21l7-7", "M21 21l-7-7"],
  reflect: ["M12 3a9 9 0 1 0 9 9", "M12 7v5l3 2", "M18 3v5h-5"],
};

interface HeroImageProps {
  monthIndex: number;
  monthLabel: string;
  icon: MonthJourneyTheme["icon"];
  theme: MonthTheme;
}

export default function HeroImage({ monthIndex, monthLabel, icon, theme }: HeroImageProps) {
  const message = MONTH_MESSAGES[monthIndex] ?? MONTH_MESSAGES[0];
  const iconPaths = MONTH_ICON_PATHS[icon];

  return (
    <div className={styles.heroWrapper}>
      <AnimatePresence mode="wait">
        <motion.div
          key={monthIndex}
          className={styles.heroTextPanel}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.34, ease: [0.4, 0, 0.2, 1] }}
        >
          <Image
            src={theme.image}
            alt={`${monthLabel} wall calendar hero`}
            fill
            priority
            className={styles.heroImg}
            sizes="(max-width: 768px) 100vw, 320px"
          />
          <div className={styles.heroOverlay} />
          <motion.svg
            className={styles.heroMonthIcon}
            width="54"
            height="54"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            animate={{ y: [0, -4, 0], scale: [1, 1.04, 1] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          >
            {iconPaths.map((path) => (
              <path key={path} d={path} />
            ))}
          </motion.svg>
          <div className={styles.heroBrand}>
            <span className={styles.heroBrandMark}>F</span>
            <span>takeUforward</span>
          </div>
          <span className={styles.heroMonthBadge}>{monthLabel}</span>
          <h2 className={styles.heroModeTitle}>{message.title}</h2>
          <p className={styles.heroQuote}>{message.quote}</p>
          <span className={styles.heroFooterLine}>Consistency beats panic.</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
