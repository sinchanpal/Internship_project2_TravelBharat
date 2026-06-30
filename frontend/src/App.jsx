import { useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import { ClipLoader } from 'react-spinners';

import { useSelector } from 'react-redux';
import useGetCurrentUser from './hooks/useGetCurrentUser';

// Import your new layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000';

function App() {
  const loading = useGetCurrentUser();
  const { userData } = useSelector(state => state.user);
  const location = useLocation();

  // Check if we are on an authentication page to optionally hide Navbar/Footer
  // Many apps prefer clean auth pages without standard navigation
  const isAuthPage = ['/signin', '/signup', '/forgot-password'].includes(location.pathname);

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex justify-center items-center">
        <ClipLoader color='white' size={50} />
      </div>
    );
  }

  return (
    // Added flex flex-col to enable sticky footers
    <div className="flex flex-col min-h-screen bg-[#DFE0EE]">

      {/* Conditionally render Navbar so it doesn't clutter Sign In/Up pages */}
      {!isAuthPage && <Navbar />}

      {/* Main content wrapper that pushes the footer down */}
      <main className="grow relative pb-14">
        <Routes>
          {/* Note: I kept my auth requirements here. If I want unregistered users to read the encyclopedia, you can remove the ternary operator on the Home route later! */}
          <Route path='/' element={userData ? <Home /> : <Navigate to={'/signin'} />} />
          <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={'/'} />} />
          <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to={'/'} />} />
          <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <Navigate to="/" />} />
        </Routes>
      </main>

      {/* Conditionally render Footer */}
      {!isAuthPage && <Footer />}

    </div>
  );
}

export default App;