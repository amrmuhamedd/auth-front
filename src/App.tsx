import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Signup } from "./pages/signup";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
