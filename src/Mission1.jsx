import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

/* (Your helper functions: shuffle, capitalize, leetifyAll, generateGuessList)
   — I kept them intact but included here for completeness.
*/

// --- helpers (copyed/unchanged from your implementation) ---
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function leetifyAll(s) {
  const map = { a: "4", A: "4", e: "3", E: "3", i: "1", I: "1", o: "0", O: "0", s: "5", S: "5", t: "7", T: "7" };
  return s.split("").map((ch) => (map[ch] || ch)).join("");
}

function generateGuessList(name, dob) {
  const guesses = new Set();
  const normalizedName = (name || "").trim();
  const lowerName = normalizedName.toLowerCase();
  const nameParts = lowerName.split(/\s+/).filter(Boolean);
  const first = nameParts[0] || "";
  const last = nameParts[nameParts.length - 1] || "";

  let year = "";
  let month = "";
  let day = "";
  if (dob) {
    const m = dob.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) {
      year = m[1];
      month = m[2];
      day = m[3];
    } else {
      const digits = dob.replace(/\D/g, "");
      if (digits.length >= 6) {
        year = digits.slice(0, 4);
        month = digits.slice(4, 6);
        day = digits.slice(6, 8) || "";
      }
    }
  }

  const common = [
    "password",
    "123456",
    "12345678",
    "qwerty",
    "abc123",
    "111111",
    "password1",
    "1234",
    "admin",
    "letmein",
    "iloveyou",
    "welcome",
    "monkey",
    "dragon",
    "user",
    "pass",
  ];

  const commonNumbers = ["123", "1234", "12345", "2020", "2021", "2022", "1990", "1991", "1111", "0000", "007"];
  const specials = ["", "!", "@", "#", "$", "_", "-", ".", "*"];

  function addVariants(root) {
    if (!root) return;
    const roots = new Set();
    roots.add(root);
    roots.add(capitalize(root));
    roots.add(root.toLowerCase());
    roots.add(root.toUpperCase());
    roots.add(leetifyAll(root));
    if (root.length >= 3) {
      roots.add(root.slice(0, 3));
      roots.add(root.slice(0, 4));
    }
    roots.add(root.split("").reverse().join(""));

    Array.from(roots).forEach((r) => {
      guesses.add(r);
      commonNumbers.forEach((n) => {
        guesses.add(r + n);
        guesses.add(r + "_" + n);
        guesses.add(r + "!" + n);
        guesses.add(r + "@" + n);
        guesses.add(n + r);
      });
      specials.forEach((s) => {
        guesses.add(r + s + "123");
        guesses.add(r + s + "2020");
        guesses.add(r + s + "2021");
        guesses.add(r + s + s);
        guesses.add(s + r);
      });
      for (let d = 0; d <= 30; d++) guesses.add(r + d);
    });
  }

  common.forEach((c) => guesses.add(c));
  commonNumbers.forEach((n) => guesses.add(n));

  addVariants(first);
  addVariants(last);
  addVariants((first + last).slice(0, 18));
  addVariants(lowerName.replace(/\s+/g, ""));

  const years = [year, year && year.slice(2), "1990", "1991", "1995", "2000", "2001", "2002", "2010"].filter(Boolean);
  years.forEach((y) => {
    if (first) {
      guesses.add(first + y);
      guesses.add(capitalize(first) + y);
      guesses.add(first + "@" + y);
      guesses.add(first + "!" + y);
      guesses.add(first + "_" + y);
    }
    if (last) guesses.add(last + y);
    guesses.add(y);
  });

  if (first && last) {
    const combos = [
      first + last,
      first + "." + last,
      first + "_" + last,
      first + "-" + last,
      capitalize(first) + capitalize(last),
      (first + last).toLowerCase(),
    ];
    combos.forEach((c) => {
      guesses.add(c);
      commonNumbers.forEach((n) => guesses.add(c + n));
      specials.forEach((s) => guesses.add(c + s + "123"));
      guesses.add(leetifyAll(c));
    });
  }

  const suffixes = ["123", "1234", "2020", "2021", "01", "10", "99", "!"];
  const prefixes = ["!", "@", "#"];
  const roots = [first, last, (first + last).replace(/\s+/g, ""), lowerName.replace(/\s+/g, "")].filter(Boolean);

  roots.forEach((r) => {
    suffixes.forEach((suf) => guesses.add(r + suf));
    prefixes.forEach((pre) => guesses.add(pre + r));
    specials.forEach((sp) => suffixes.forEach((suf) => guesses.add(r + sp + suf)));
  });

  Array.from(common).forEach((c) => {
    guesses.add(capitalize(c));
    guesses.add(leetifyAll(c));
  });

  for (let n = 0; n < 200; n++) guesses.add(String(n));
  for (let n = 1000; n < 1100; n += 3) guesses.add(String(n));

  const guessArr = shuffle(Array.from(guesses));
  const prioritized = ["123456", "password", "qwerty", "abc123", "111111", "1234", "password1"];
  return [...prioritized.filter((p) => guessArr.includes(p)), ...guessArr.filter((g) => !prioritized.includes(g))];
}
// --- end helpers ---

export default function Mission1() {
  const [stage, setStage] = useState("collect"); // collect -> create -> attack -> result
  const [name, setName] = useState("");
  const [dob, setDob] = useState(""); // yyyy-mm-dd
  const [password, setPassword] = useState("");
  const [lives, setLives] = useState(3);
  const [message, setMessage] = useState("");
  const [attackerProgress, setAttackerProgress] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [guessCount, setGuessCount] = useState(0);
  const [attackSpeed, setAttackSpeed] = useState(80); // ms per guess
  const [attackerList, setAttackerList] = useState([]);
  const attemptRef = useRef(null);

  // cleanup on unmount to avoid stray intervals
  useEffect(() => {
    return () => {
      if (attemptRef.current) clearInterval(attemptRef.current);
    };
  }, []);

  useEffect(() => {
    // reset small state when stage changes
    setAttackerProgress(0);
    setCurrentGuess("");
    setGuessCount(0);
    setMessage("");
    // ensure any running interval is stopped when changing stage
    if (attemptRef.current) {
      clearInterval(attemptRef.current);
      attemptRef.current = null;
    }
  }, [stage]);

  function goToCreate() {
    if (!name.trim()) {
      setMessage("Please enter your name.");
      return;
    }
    setStage("create");
    setMessage("");
  }

  function submitPassword() {
    if (!password) {
      setMessage("Please enter a password.");
      return;
    }
    // prepare attacker list
    const list = generateGuessList(name, dob);
    setAttackerList(list);
    setStage("attack");
    setMessage("");
    // start attack after a tiny delay to show animation
    setTimeout(() => simulateAttack(list, password), 400);
  }

  function simulateAttack(list, userPassword) {
    // clear any previous interval
    if (attemptRef.current) {
      clearInterval(attemptRef.current);
      attemptRef.current = null;
    }

    // attacker tries guesses sequentially; compare case-insensitive
    let i = 0;
    setAttackerProgress(0);
    setGuessCount(0);
    setCurrentGuess("");
    const augmented = [...list];
    // if password is very short, expand list with brute-force digits
    if (userPassword.length <= 6) {
      for (let n = 0; n < 5000; n += 13) augmented.push(String(n));
    }
    const total = augmented.length;
    const target = String(userPassword).toLowerCase();

    attemptRef.current = setInterval(() => {
      if (i >= augmented.length) {
        clearInterval(attemptRef.current);
        attemptRef.current = null;
        setAttackerProgress(100);
        setStage("result");
        setMessage("Attacker failed to guess your password. Mission Cleared!");
        return;
      }
      const guess = augmented[i];
      setCurrentGuess(guess);
      setGuessCount((c) => c + 1);

      // progress
      const prog = Math.round(((i + 1) / total) * 100);
      setAttackerProgress(prog);

      // compare normalized values (case-insensitive)
      if (String(guess).toLowerCase() === target) {
        clearInterval(attemptRef.current);
        attemptRef.current = null;
        setMessage(`Attacker guessed your password! Guess: ${guess}`);
        setStage("result");
        // decrement life after a slight delay so UI updates
        setTimeout(() => {
          setLives((prev) => Math.max(0, prev - 1));
        }, 400);
        return;
      }

      i++;
    }, attackSpeed);
  }

  function retry() {
    if (lives <= 0) {
      setMessage("No lives left — mission failed. Return to missions menu.");
      return;
    }
    // stop any running attack
    if (attemptRef.current) {
      clearInterval(attemptRef.current);
      attemptRef.current = null;
    }
    setPassword("");
    setStage("create");
    setMessage("");
  }

  function giveUp() {
    if (attemptRef.current) {
      clearInterval(attemptRef.current);
      attemptRef.current = null;
    }
    setStage("complete-fail");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-black/50 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
        <h2 className="text-3xl font-bold mb-4">Mission 1 — Password Strength</h2>
        <p className="text-sm text-gray-300 mb-6">
          In this mission you will create a password. The attacker knows your name and DOB and will try common
          guesses that people often use. You have <span className="font-bold">{lives}</span> lives — each time the attacker
          successfully guesses your password you lose one life. If the attacker fails to guess, you pass the mission.
        </p>

        {stage === "collect" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarthak Kumar"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Date of Birth</label>
              <input
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                placeholder="YYYY-MM-DD (optional, helps simulation)"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={goToCreate}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold"
              >
                Next → Create Password
              </button>
              <button
                onClick={() => {
                  setName("");
                  setDob("");
                }}
                className="px-4 py-2 border border-gray-700 rounded-md"
              >
                Reset
              </button>
            </div>

            {message && <div className="text-yellow-300 mt-2">{message}</div>}
          </div>
        )}

        {stage === "create" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Create Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password to protect your account"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
                type="password"
              />
              <div className="text-xs text-gray-400 mt-2">
                Tip: avoid using your name, birthdate or common sequences like 1234.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={submitPassword}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-md font-semibold"
              >
                Submit Password
              </button>
              <button
                onClick={() => setStage("collect")}
                className="px-4 py-2 border border-gray-700 rounded-md"
              >
                Back
              </button>

              <div className="ml-auto flex items-center gap-2">
                <label className="text-xs text-gray-300">Speed</label>
                <input
                  type="range"
                  min="20"
                  max="300"
                  value={attackSpeed}
                  onChange={(e) => setAttackSpeed(Number(e.target.value))}
                />
              </div>
            </div>

            {message && <div className="text-yellow-300 mt-2">{message}</div>}
          </div>
        )}

        {stage === "attack" && (
          <div className="space-y-4">
            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <div>Attacker progress</div>
                <div>{attackerProgress}%</div>
              </div>
              <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white"
                  style={{ width: `${attackerProgress}%`, transition: "width 120ms linear" }}
                />
              </div>

              <div className="mt-3 text-sm text-gray-300">
                <div>Current guess: <span className="font-mono">{currentGuess || "—"}</span></div>
                <div>Guesses tried: {guessCount}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (attemptRef.current) {
                    clearInterval(attemptRef.current);
                    attemptRef.current = null;
                  }
                  setAttackerProgress(100);
                  setStage("result");
                  setMessage("You forced the attacker to stop — attacker failed to guess.");
                }}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md"
              >
                Stop Attack (Force Fail)
              </button>

              <button
                onClick={() => {
                  if (attemptRef.current) {
                    clearInterval(attemptRef.current);
                    attemptRef.current = null;
                  }
                  setStage("create");
                  setMessage("Stopped. Try a different password.");
                }}
                className="px-4 py-2 border border-gray-700 rounded-md"
              >
                Abort & Try Again
              </button>
            </div>

            {message && <div className="text-yellow-300 mt-2">{message}</div>}
          </div>
        )}

        {stage === "result" && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-900">
              <div className="text-lg font-semibold">
                {message.includes("failed") ? "Mission Success" : "Attack Successful"}
              </div>
              <div className="text-sm text-gray-300 mt-2">{message}</div>
              <div className="mt-4">
                <div className="text-sm">Lives left: <span className="font-bold">{lives}</span></div>
              </div>
            </div>

            <div className="flex gap-3 mt-3">
              {message.includes("failed") ? (
                <button
                  onClick={() => {
                    setStage("complete-success");
                    setMessage("Mission cleared — great job!");
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-md"
                >
                  Continue
                </button>
              ) : (
                <>
                  <button
                    onClick={retry}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md"
                  >
                    Retry (Change Password)
                  </button>
                  <button onClick={giveUp} className="px-4 py-2 border border-gray-700 rounded-md">
                    Give Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {stage === "complete-success" && (
          <div className="text-center space-y-4">
            <div className="text-2xl font-bold">Mission Completed ✅</div>
            <div className="text-gray-300">
              You successfully defended your account. Proceed to the next mission.
            </div>
            <div className="mt-4">
              <button
                onClick={() => {
                  setMessage("");
                  alert("Go to next mission (implement navigation in parent).");
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-md"
              >
                Next Mission
              </button>
            </div>
          </div>
        )}

        {stage === "complete-fail" && (
          <div className="text-center space-y-4">
            <div className="text-2xl font-bold text-red-400">Mission Failed ❌</div>
            <div className="text-gray-300">
              You have no lives left. Study the tips and try again later.
            </div>
            <div className="mt-4">
              <button
                onClick={() => {
                  alert("Return to missions (implement navigation in parent).");
                }}
                className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
              >
                Back to Missions
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
