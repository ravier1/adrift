import { motion } from "framer-motion";
import type { ReactNode } from "react";
import styles from "./PageTransition.module.css";

interface PageTransitionProps {
  children: ReactNode;
  transitionType?: "purple" | "red";
}

const PageTransition = ({ children, transitionType = "purple" }: PageTransitionProps) => {
  return (
    <>
      <motion.div
        className={styles.gradientOverlay}
        initial={{ scaleX: 0 }}
        animate={{ 
          scaleX: [0, 1, 1, 0],
          transformOrigin: ["0% 0%", "0% 0%", "100% 0%", "100% 0%"],
        }}
        transition={{ 
          duration: 1.2, // Faster duration
          times: [0, 0.3, 0.7, 1], // Adjusted timing
          ease: "easeInOut"
        }}
      >
        <motion.div
          className={`${styles.gradient} ${styles[transitionType]}`}
          animate={{
            x: ["0%", "200%"]
          }}
          transition={{
            duration: 1.2, // Match parent duration
            ease: "easeInOut"
          }}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default PageTransition;
