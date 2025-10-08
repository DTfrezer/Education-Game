import { motion } from "framer-motion";

export default function Mascot() {
  return (
    <motion.img
      src="/assets/mascot.png" // path from public folder
      alt="Guide Mascot"
      className="absolute bottom-10 left-10 w-44 h-44 z-10 drop-shadow-2xl"
      initial={{ y: 0, scale: 0.95, rotate: -2, opacity: 0 }}
      animate={{
        y: [0, -10, 0],          // small bounce
        scale: [0.95, 1.05, 0.95], // subtle breathing effect
        rotate: [-2, 2, -2],      // slight rotation
        opacity: [0, 1, 0.9],     // fade in/out slightly
        filter: ["drop-shadow(0 0 10px #fff)", "drop-shadow(0 0 15px #ffd700)", "drop-shadow(0 0 10px #fff)"] // glowing effect
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}
