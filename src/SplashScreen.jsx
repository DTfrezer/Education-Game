import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

  // Animate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onFinish(); // Navigate to login page
          return 100;
        }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      {/* Logo with subtle pulse */}
      <motion.img
        src="/assets/logo.png" // your logo in public folder
        alt="Logo"
        className="w-96 h-96 mb-12" // bigger logo
        initial={{ scale: 0.95 }}
        animate={{ scale: [0.95, 1.05, 0.98, 1] }} // subtle pulse
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* White loading bar */}
      <div className="w-96 h-4 bg-gray-700 rounded-full overflow-hidden mt-4 relative">
        <motion.div
          className="h-full bg-white absolute left-0 top-0"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear" }}
        />
        {/* Simple shimmer effect */}
        <motion.div
          className="h-full w-16 bg-white opacity-20 absolute top-0 left-0"
          animate={{ x: [-80, 320] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        />
      </div>

      {/* Percentage */}
      <p className="text-gray-400 mt-4 text-lg">{progress}%</p>
    </div>
  );
}
