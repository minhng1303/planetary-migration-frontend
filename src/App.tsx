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
import Dashboard from "./dashboard/Dashboard";
import { PlanetDetailPage } from "./pages/Planets/PlanetDetail";
import AppTheme from "./shared-theme/AppTheme";
import { PlanetCreate } from "./pages/Planets/PlanetCreate";

function App() {
  return (
    <Router>
      <AppTheme>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              {/* <Route path="/planets" element={
                        <PrivateRoute>
                          <PlanetDashboard />
                        </PrivateRoute>
                      } /> */}

              {/* <Route
              path="/planets/:id"
              element={
                <PrivateRoute>
                  <PlanetDetail />
                </PrivateRoute>
              }
            /> */}

              {/* <Route
                path="/planets/new"
                element={
                  <PrivateRoute roles={["SuperAdmin", "PlanetAdmin"]}>
                    <PlanetCreate />
                  </PrivateRoute>
                }
              /> */}

              {/* <Route
                path="/analytics"
                element={
                  <PrivateRoute>
                    <EvaluationPage />
                  </PrivateRoute>
                }
              /> */}

              <Route path="/planets" element={<Dashboard />} />
              <Route path="/planets/:id" element={<PlanetDetailPage />} />
              <Route path="/planets/new" element={<PlanetCreate />} />
              <Route path="/analytics" element={<EvaluationPage />} />
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
