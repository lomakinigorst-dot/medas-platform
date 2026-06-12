import type { Variants } from "framer-motion";

export function staggerContainer(stagger = 0.1): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: stagger } },
  };
}

export function fadeUpItem(y = 20, duration = 0.55): Variants {
  return {
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration, ease: "easeOut" } },
  };
}
