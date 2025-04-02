import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import ContextProvider from './context/Context.jsx';
import LandingPage from './components/Pages/LandingPage/LandingPage';
import Login from './components/Pages/Login/login.jsx';
import SignUp from './components/Pages/SignUp/SignUp';
import Main from './components/Main/Main';
import Profile from './components/Pages/Profile/Profile';
import Dashboard from './components/Pages/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import { auth } from './config/firebase';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ContextProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/main" element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        

        <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard userId={auth.currentUser ? auth.currentUser.uid : null} />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </Router>
  </ContextProvider>
);
