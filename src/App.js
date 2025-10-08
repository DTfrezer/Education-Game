import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SplashScreen from "./SplashScreen";
import LoginPage from "./LoginPage";
import MissionsPage from "./MissionsPage";
import Mission1 from "./Mission1"; // import Mission 1 component
import { useState } from "react";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <Router>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/mission1" element={<Mission1 />} /> {/* Mission 1 route */}
        </Routes>
      )}
    </Router>
  );
}

export default App;
