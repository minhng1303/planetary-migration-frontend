import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/Auth/PrivateRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/Auth/LoginPage';
import { PlanetDashboard } from './pages/Planets/PlanetDashboard';
import { PlanetDetail } from './pages/Planets/PlanetDetail';
import { PlanetCreate } from './pages/Planets/PlanetCreate';
import { EvaluationPage } from './pages/Planets/EvaluationPage';
import { Layout } from './components/Layout/Layout';

function App() {

  return (
<Router>
      <AuthProvider>
          <Routes>
                 <Route element={<Layout />}>
                      <Route path="/" element={
                        <PrivateRoute>
                          <HomePage />
                        </PrivateRoute>
                      } />
                      
                      <Route path="/planets" element={
                        <PrivateRoute>
                          <PlanetDashboard />
                        </PrivateRoute>
                      } />
                      
                      <Route path="/planets/:id" element={
                        <PrivateRoute>
                          <PlanetDetail />
                        </PrivateRoute>
                      } />
                      
                      <Route path="/planets/new" element={
                        <PrivateRoute roles={['SuperAdmin', 'PlanetAdmin']}>
                          <PlanetCreate />
                        </PrivateRoute>
                      } />
                      
                      <Route path="/evaluate" element={
                        <PrivateRoute>
                          <EvaluationPage />
                        </PrivateRoute>
                      } />
                 </Route>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
    </AuthProvider>
</Router>
  );
}

export default App;