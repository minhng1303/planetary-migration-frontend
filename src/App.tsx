import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LoginPage } from "./pages/Auth/LoginPage";
import { EvaluationPage } from "./pages/Planets/EvaluationPage";
import { Layout } from "./components/Layout/Layout";
import AppTheme from "./shared-theme/AppTheme";
import { PlanetCreate } from "./pages/Planets/PlanetCreate";
import { PlanetDetailPage } from "./pages/Planets/PlanetDetail";
import PrivateRoute from "./components/Auth/PrivateRoute";
import { Toaster } from "react-hot-toast";
import { FactorPage } from "./pages/Factor/FactorPage";
import Dashboard from "./pages/Planets/Dashboard";

function App() {
  return (
    <Router>
      <AppTheme>
        <AuthProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <Routes>
            <Route element={<Layout />}>
              <Route
                path="/planets"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/planets/:id"
                element={
                  <PrivateRoute>
                    <PlanetDetailPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/planets/new"
                element={
                  <PrivateRoute roles={["SuperAdmin", "PlanetAdmin"]}>
                    <PlanetCreate />
                  </PrivateRoute>
                }
              />

              <Route
                path="/analytics"
                element={
                  <PrivateRoute>
                    <EvaluationPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/factors"
                element={
                  <PrivateRoute>
                    <FactorPage />
                  </PrivateRoute>
                }
              />

              <Route path="*" element={<Navigate to="/planets" replace />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </AuthProvider>
      </AppTheme>
    </Router>
  );
}

export default App;
