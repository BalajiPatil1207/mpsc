import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Study from './pages/Study';
import Tests from './pages/Tests';
import Quiz from './pages/Quiz';
import AICoach from './pages/AICoach';
import AdminSyllabus from './pages/AdminSyllabus';
import Scanner from './pages/Scanner';
import Result from './pages/Result';
import Profile from './pages/Profile';
import Vault from './pages/Vault';

import Navbar from './components/common/Navbar';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/study" 
            element={
              <ProtectedRoute>
                <Study />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tests" 
            element={
              <ProtectedRoute>
                <Tests />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/test-engine" 
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ai-coach" 
            element={
              <ProtectedRoute>
                <AICoach />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/syllabus" 
            element={
              <ProtectedRoute>
                <AdminSyllabus />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/scanner" 
            element={
              <ProtectedRoute>
                <Scanner />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/result" 
            element={
              <ProtectedRoute>
                <Result />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vault" 
            element={
              <ProtectedRoute>
                <Vault />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
