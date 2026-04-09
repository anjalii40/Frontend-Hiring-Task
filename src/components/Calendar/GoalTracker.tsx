"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
  type Transition,
  type Variants,
} from "framer-motion";
import styles from "./Calendar.module.css";
import {
  CALENDAR_END_DATE,
  CALENDAR_START_DATE,
  clampDateStringToCalendarYear,
  toCalendarDate,
  toInputDate,
} from "@/data/calendarConfig";

type GoalMode = "weekly" | "monthly";
type GoalSection = "daily" | "longTerm" | "tasks";

type GoalTask = {
  id: string;
  title: string;
  completed: boolean;
};

type GoalState = {
  dailyTarget: number;
  longTermTarget: number;
  longTermMode: GoalMode;
  rangeStart: string;
  rangeEnd: string;
  tasks: GoalTask[];
};

const STORAGE_KEY = "app-goal-tracker-v1";
const smoothTransition: Transition = { duration: 0.28, ease: [0.4, 0, 0.2, 1] };

const defaultTasks: GoalTask[] = [
  { id: "arrays-patterns", title: "Array pattern practice", completed: false },
  { id: "two-pointer", title: "Two pointer drill", completed: false },
  { id: "binary-search", title: "Binary search revision", completed: false },
  { id: "dp-streak", title: "DP streak problem", completed: false },
  { id: "editorial-notes", title: "Update solution notes", completed: false },
];

const CONFETTI_PARTICLES = [
  { x: -72, y: -80, rotate: -54, delay: 0, color: "var(--accent)" },
  { x: -48, y: -96, rotate: 24, delay: 0.03, color: "var(--text-primary)" },
  { x: -22, y: -76, rotate: 88, delay: 0.05, color: "var(--accent)" },
  { x: 8, y: -98, rotate: -28, delay: 0.02, color: "var(--text-secondary)" },
  { x: 34, y: -82, rotate: 64, delay: 0.06, color: "var(--accent)" },
  { x: 62, y: -70, rotate: -96, delay: 0.04, color: "var(--text-primary)" },
  { x: -82, y: -42, rotate: 120, delay: 0.08, color: "var(--text-secondary)" },
  { x: -56, y: -48, rotate: -108, delay: 0.1, color: "var(--accent)" },
  { x: -28, y: -36, rotate: 42, delay: 0.07, color: "var(--text-primary)" },
  { x: 28, y: -40, rotate: -36, delay: 0.09, color: "var(--accent)" },
  { x: 58, y: -46, rotate: 112, delay: 0.11, color: "var(--text-secondary)" },
  { x: 82, y: -34, rotate: -72, delay: 0.08, color: "var(--accent)" },
] as const;

const trackerVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...smoothTransition,
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: smoothTransition },
};

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function getInitialState(): GoalState {
  const today = toCalendarDate(new Date());

  return {
    dailyTarget: 5,
    longTermTarget: 25,
    longTermMode: "weekly",
    rangeStart: toInputDate(today),
    rangeEnd: toInputDate(addDays(today, 6)),
    tasks: defaultTasks,
  };
}

function getStoredState(): GoalState {
  const fallback = getInitialState();
  if (typeof window === "undefined") return fallback;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return fallback;

    const parsed = JSON.parse(saved) as Partial<GoalState>;
    const longTermMode: GoalMode = parsed.longTermMode === "monthly" ? "monthly" : "weekly";

    return {
      ...fallback,
      ...parsed,
      tasks: Array.isArray(parsed.tasks) && parsed.tasks.length > 0 ? parsed.tasks : fallback.tasks,
      dailyTarget: clampNumber(Number(parsed.dailyTarget ?? fallback.dailyTarget), 1, 99),
      longTermTarget: clampNumber(Number(parsed.longTermTarget ?? fallback.longTermTarget), 1, 999),
      longTermMode,
      rangeStart: clampDateStringToCalendarYear(parsed.rangeStart ?? fallback.rangeStart, fallback.rangeStart),
      rangeEnd: clampDateStringToCalendarYear(parsed.rangeEnd ?? fallback.rangeEnd, fallback.rangeEnd),
    };
  } catch {
    return fallback;
  }
}

function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function getPercent(completed: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((completed / total) * 100));
}

function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => `${Math.round(latest)}${suffix}`);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    });

    return () => controls.stop();
  }, [motionValue, value]);

  return <motion.span>{rounded}</motion.span>;
}

function TargetIcon() {
  return (
    <motion.svg
      className={styles.goalIcon}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      animate={{ y: [0, -2, 0], rotate: [0, 3, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3" />
      <path d="M12 19v3" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
    </motion.svg>
  );
}

function CalendarIcon() {
  return (
    <motion.svg
      className={styles.goalIcon}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      animate={{ y: [0, -2, 0], rotate: [0, -2, 0] }}
      transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
    </motion.svg>
  );
}

function ListIcon() {
  return (
    <motion.svg
      className={styles.goalIcon}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      animate={{ scale: [1, 1.06, 1] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d="M9 6h11" />
      <path d="M9 12h11" />
      <path d="M9 18h11" />
      <path d="M4 6h.01" />
      <path d="M4 12h.01" />
      <path d="M4 18h.01" />
    </motion.svg>
  );
}

function ProgressBar({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className={styles.progressTrack} aria-label={label}>
      <motion.div
        className={styles.progressFill}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

function TargetStepper({
  id,
  label,
  value,
  min,
  max,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const setNextValue = (nextValue: number) => {
    onChange(clampNumber(nextValue, min, max));
  };

  return (
    <div className={styles.targetStepper} id={id} role="group" aria-label={label}>
      <motion.button
        type="button"
        className={styles.targetStepperBtn}
        onClick={() => setNextValue(value - 1)}
        disabled={value <= min}
        aria-label={`Decrease ${label}`}
        whileHover={{ scale: value <= min ? 1 : 1.06 }}
        whileTap={{ scale: value <= min ? 1 : 0.94 }}
      >
        −
      </motion.button>
      <motion.span
        key={value}
        className={styles.targetStepperValue}
        initial={{ y: 6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
        aria-live="polite"
      >
        {value}
      </motion.span>
      <motion.button
        type="button"
        className={styles.targetStepperBtn}
        onClick={() => setNextValue(value + 1)}
        disabled={value >= max}
        aria-label={`Increase ${label}`}
        whileHover={{ scale: value >= max ? 1 : 1.06 }}
        whileTap={{ scale: value >= max ? 1 : 0.94 }}
      >
        +
      </motion.button>
    </div>
  );
}

function DailyGoalConfetti() {
  return (
    <motion.div
      className={styles.dailyConfetti}
      initial={{ opacity: 1, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      aria-hidden="true"
    >
      {CONFETTI_PARTICLES.map((particle, index) => (
        <motion.span
          key={`${particle.x}-${particle.y}`}
          className={styles.confettiPiece}
          style={{ background: particle.color }}
          initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.4 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: particle.x,
            y: particle.y,
            rotate: particle.rotate,
            scale: [0.4, 1, 0.75],
          }}
          transition={{
            duration: 0.9,
            delay: particle.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          data-round={index % 3 === 0 ? "true" : undefined}
        />
      ))}
    </motion.div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <motion.svg
      className={styles.dropdownChevron}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ rotate: open ? 180 : 0 }}
      transition={smoothTransition}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </motion.svg>
  );
}

function GoalDropdown({
  id,
  title,
  icon,
  open,
  onToggle,
  className = "",
  children,
}: {
  id: GoalSection;
  title: string;
  icon: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const contentId = `${id}-goal-content`;

  return (
    <motion.article
      className={`${styles.goalPanel} ${className}`}
      variants={itemVariants}
      layout
      whileHover={{ y: -3, scale: 1.005 }}
    >
      <motion.button
        className={styles.goalPanelHeaderButton}
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={contentId}
        whileTap={{ scale: 0.98 }}
      >
        <span className={styles.goalPanelHeader}>
          {icon}
          <span className={styles.goalPanelTitle}>{title}</span>
        </span>
        <ChevronIcon open={open} />
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={contentId}
            className={styles.goalPanelBody}
            initial={{ height: 0, opacity: 0, y: -4 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -4 }}
            transition={smoothTransition}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function GoalTracker() {
  const [state, setState] = useState<GoalState>(() => getStoredState());
  const [newTask, setNewTask] = useState("");
  const [showDailyConfetti, setShowDailyConfetti] = useState(false);
  const hasTrackedDailyCompletionRef = useRef(false);
  const wasDailyCompleteRef = useRef(false);
  const [openSections, setOpenSections] = useState<Record<GoalSection, boolean>>({
    daily: true,
    longTerm: false,
    tasks: false,
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const completedTasks = useMemo(
    () => state.tasks.filter((task) => task.completed).length,
    [state.tasks]
  );
  const dailyComplete = state.dailyTarget > 0 && completedTasks >= state.dailyTarget;
  const longTermPercent = getPercent(completedTasks, state.longTermTarget);
  const remainingLongTerm = Math.max(state.longTermTarget - completedTasks, 0);
  const sortedTasks = useMemo(
    () => [...state.tasks].sort((a, b) => Number(a.completed) - Number(b.completed)),
    [state.tasks]
  );

  useEffect(() => {
    if (!hasTrackedDailyCompletionRef.current) {
      hasTrackedDailyCompletionRef.current = true;
      wasDailyCompleteRef.current = dailyComplete;
      return;
    }

    if (dailyComplete && !wasDailyCompleteRef.current) {
      wasDailyCompleteRef.current = true;
      const startTimer = setTimeout(() => setShowDailyConfetti(true), 0);
      const stopTimer = setTimeout(() => setShowDailyConfetti(false), 1250);
      return () => {
        clearTimeout(startTimer);
        clearTimeout(stopTimer);
      };
    }

    if (!dailyComplete) {
      wasDailyCompleteRef.current = false;
    }
  }, [dailyComplete]);

  const updateMode = (mode: GoalMode) => {
    const days = mode === "weekly" ? 6 : 29;

    setState((current) => {
      const start = current.rangeStart ? new Date(`${current.rangeStart}T00:00:00`) : new Date();

      return {
        ...current,
        longTermMode: mode,
        rangeEnd: toInputDate(addDays(start, days)),
      };
    });
  };

  const addTask = () => {
    const title = newTask.trim();
    if (!title) return;

    setState((current) => ({
      ...current,
      tasks: [
        { id: `${Date.now()}-${title.toLowerCase().replace(/\s+/g, "-")}`, title, completed: false },
        ...current.tasks,
      ],
    }));
    setNewTask("");
  };

  const toggleTask = (taskId: string) => {
    setState((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  const toggleSection = (section: GoalSection) => {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  return (
    <motion.section
      className={styles.goalTracker}
      variants={trackerVariants}
      initial="hidden"
      animate="visible"
      aria-labelledby="goal-tracker-title"
    >
      <motion.div className={styles.goalHeader} variants={itemVariants}>
        <div className={styles.goalHeaderInfo}>
          <span className={styles.goalEyebrow}>Goal tracker</span>
          <h2 id="goal-tracker-title" className={styles.goalTitle}>
            Daily Streak
          </h2>
        </div>
        <div className={styles.goalSummaryPill} aria-label={`${completedTasks} of ${state.tasks.length} tasks done`}>
          <AnimatePresence>
            {showDailyConfetti && <DailyGoalConfetti />}
          </AnimatePresence>
          <div className={styles.goalSplitStat}>
            <span className={styles.goalSplitCount}>
              <AnimatedNumber value={completedTasks} />
              <span>/</span>
              <AnimatedNumber value={state.tasks.length} />
            </span>
            <span className={styles.goalSplitLabel}>Done</span>
            <div className={styles.goalSplitTrack} aria-hidden="true">
              <motion.span
                className={styles.goalSplitFill}
                initial={{ width: 0 }}
                animate={{ width: `${getPercent(completedTasks, state.tasks.length)}%` }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className={styles.goalGrid}>
        <GoalDropdown
          id="daily"
          title="Daily goal"
          icon={<TargetIcon />}
          open={openSections.daily}
          onToggle={() => toggleSection("daily")}
        >
          <div className={styles.compactFieldRow}>
            <span className={`${styles.inputLabel} ${styles.inlineFieldLabel}`}>Target</span>
            <TargetStepper
              id="daily-target"
              label="daily target"
              value={state.dailyTarget}
              min={1}
              max={99}
              onChange={(value) =>
                setState((current) => ({
                  ...current,
                  dailyTarget: value,
                }))
              }
            />
          </div>
          <p className={styles.goalComment}>Set how many problems you want to finish today.</p>
        </GoalDropdown>

        <GoalDropdown
          id="longTerm"
          title="Monthly progress"
          icon={<CalendarIcon />}
          open={openSections.longTerm}
          onToggle={() => toggleSection("longTerm")}
        >
          <div className={styles.modeToggle} aria-label="Long-term goal type">
            {(["weekly", "monthly"] as GoalMode[]).map((mode) => (
              <motion.button
                key={mode}
                className={`${styles.modeBtn} ${state.longTermMode === mode ? styles.modeBtnActive : ""}`}
                type="button"
                onClick={() => updateMode(mode)}
                whileTap={{ scale: 0.96 }}
              >
                {mode}
              </motion.button>
            ))}
          </div>

          <div className={styles.dateGrid}>
            <label className={styles.inputLabel} htmlFor="range-start">
              Start
              <input
                id="range-start"
                className={styles.goalInput}
                type="date"
                value={state.rangeStart}
                onChange={(event) =>
                  setState((current) => ({ ...current, rangeStart: event.target.value }))
                }
                min={CALENDAR_START_DATE}
                max={CALENDAR_END_DATE}
              />
            </label>
            <label className={styles.inputLabel} htmlFor="range-end">
              End
              <input
                id="range-end"
                className={styles.goalInput}
                type="date"
                value={state.rangeEnd}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    rangeEnd: clampDateStringToCalendarYear(event.target.value, current.rangeEnd),
                  }))
                }
                min={CALENDAR_START_DATE}
                max={CALENDAR_END_DATE}
              />
            </label>
          </div>

          <div className={styles.compactFieldRow}>
            <span className={`${styles.inputLabel} ${styles.inlineFieldLabel}`}>Total tasks</span>
            <TargetStepper
              id="long-term-target"
              label="monthly progress target"
              value={state.longTermTarget}
              min={1}
              max={999}
              onChange={(value) =>
                setState((current) => ({
                  ...current,
                  longTermTarget: value,
                }))
              }
            />
          </div>

          <div className={styles.statsGrid}>
            <span>Total <strong>{state.longTermTarget}</strong></span>
            <span>Done <strong>{completedTasks}</strong></span>
            <span>Left <strong>{remainingLongTerm}</strong></span>
            <span>Progress <strong><AnimatedNumber value={longTermPercent} suffix="%" /></strong></span>
          </div>
          <ProgressBar value={longTermPercent} label="Long-term goal progress" />
        </GoalDropdown>

        <GoalDropdown
          id="tasks"
          title="Task list"
          icon={<ListIcon />}
          open={openSections.tasks}
          onToggle={() => toggleSection("tasks")}
          className={styles.taskPanel}
        >
          <div className={styles.addTaskRow}>
            <input
              className={styles.goalInput}
              type="text"
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") addTask();
              }}
              placeholder="Add a problem or task"
              aria-label="Add a problem or task"
            />
            <motion.button
              className={styles.addTaskBtn}
              type="button"
              onClick={addTask}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
            >
              Add
            </motion.button>
          </div>

          <motion.ul className={styles.taskList} layout>
            <AnimatePresence initial={false}>
              {sortedTasks.map((task) => (
                <motion.li
                  key={task.id}
                  className={`${styles.taskItem} ${task.completed ? styles.taskCompleted : ""}`}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{
                    opacity: task.completed ? 0.68 : 1,
                    x: task.completed ? 8 : 0,
                    y: 0,
                  }}
                  exit={{ opacity: 0, x: 18, height: 0 }}
                  transition={smoothTransition}
                >
                  <motion.button
                    type="button"
                    className={`${styles.checkboxBtn} ${task.completed ? styles.checkboxBtnChecked : ""}`}
                    onClick={() => toggleTask(task.id)}
                    aria-pressed={task.completed}
                    aria-label={`Mark ${task.title} ${task.completed ? "incomplete" : "complete"}`}
                    animate={task.completed ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                    transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <AnimatePresence>
                      {task.completed && (
                        <motion.span
                          className={styles.checkboxPulse}
                          initial={{ scale: 0.5, opacity: 0.45 }}
                          animate={{ scale: 2.2, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.55, ease: "easeOut" }}
                        />
                      )}
                    </AnimatePresence>
                    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                      <motion.path
                        d="M3.2 8.4 6.5 11.4 12.8 4.6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={false}
                        animate={{ pathLength: task.completed ? 1 : 0, opacity: task.completed ? 1 : 0 }}
                        transition={{ duration: 0.28, ease: "easeInOut" }}
                      />
                    </svg>
                  </motion.button>
                  <span className={styles.taskText}>{task.title}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </GoalDropdown>
      </div>
    </motion.section>
  );
}
