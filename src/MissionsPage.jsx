import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // import navigate
import Mascot from "./Mascot"; // your mascot component

export default function MissionsPage() {
  const navigate = useNavigate(); // initialize navigate

  const missions = [
    {
      id: 1,
      title: "Password Strength",
      description: "Test and improve password security.",
      color: "bg-gradient-to-br from-purple-700 to-purple-500",
      dialogue: "Ah! Welcome, warrior! Your first mission is to master passwords. Stay sharp!",
      route: "/mission1", // route for mission 1 page
    },
    {
      id: 2,
      title: "Firewall Defense",
      description: "Protect the system by configuring firewalls correctly.",
      color: "bg-gradient-to-br from-blue-700 to-blue-500",
      dialogue: "Next up: firewalls! Configure them wisely to defend your kingdom.",
      route: "/mission2",
    },
    {
      id: 3,
      title: "Phishing Detection",
      description: "Identify phishing emails and secure user data.",
      color: "bg-gradient-to-br from-green-700 to-green-500",
      dialogue: "Finally, phishing! Spot the traps before they harm your citizens.",
      route: "/mission3",
    },
  ];

  const cardVariants = {
    hover: {
      scale: 1.05,
      y: -8,
      boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.6)",
      transition: { type: "spring", stiffness: 300 },
    },
    tap: { scale: 0.95 },
  };

  const [dialogue, setDialogue] = useState(
    "Greetings, hero! I am your guide. Hover over a mission and I’ll tell you what to do."
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center py-12 px-6 overflow-hidden">
      {/* Mascot */}
      <Mascot />

      {/* Speech Bubble */}
      <motion.div
        className="absolute bottom-56 left-10 bg-gray-800 bg-opacity-90 text-white p-4 rounded-xl w-80 drop-shadow-2xl z-30"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-sm">{dialogue}</p>
        <div className="absolute -bottom-4 left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-800"></div>
      </motion.div>

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-yellow-400 mb-12 text-center drop-shadow-xl z-20">
        Choose Your Mission
      </h1>

      {/* Mission Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl z-20">
        {missions.map((mission) => (
          <motion.div
            key={mission.id}
            className={`${mission.color} rounded-3xl shadow-2xl p-8 flex flex-col justify-between text-white relative overflow-hidden cursor-pointer`}
            whileHover="hover"
            whileTap="tap"
            variants={cardVariants}
            onMouseEnter={() => setDialogue(mission.dialogue)}
            onMouseLeave={() =>
              setDialogue(
                "Greetings, hero! I am your guide. Hover over a mission and I’ll tell you what to do."
              )
            }
          >
            {/* Floating background effects */}
            <motion.div
              className="absolute w-32 h-32 bg-white opacity-10 rounded-full top-[-10px] right-[-20px]"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute w-24 h-24 bg-white opacity-10 rounded-full bottom-[-10px] left-[-20px]"
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />

            {/* Mission Content */}
            <h2 className="text-2xl font-bold mb-4 drop-shadow-md">{mission.title}</h2>
            <p className="text-white/80">{mission.description}</p>
            <button
              onClick={() => navigate(mission.route)} // navigate to mission page
              className="mt-6 bg-white text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-gray-200 shadow-md"
            >
              Start
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
