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

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminDashboard from './pages/adminPages/AdminDashboard';
import AddState from './pages/adminPages/AddState';
import AddCity from './pages/adminPages/AddCity';
import StateDetails from './pages/StateDetails';
import AddTouristPlace from './pages/adminPages/AddTouristPlace';
import CityDetails from './pages/CityDetails';



export const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000';

function App() {
  const loading = useGetCurrentUser();
  const { userData } = useSelector(state => state.user);
  const location = useLocation();

  const isAuthPage = ['/signin', '/signup', '/forgot-password'].includes(location.pathname);

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex justify-center items-center">
        <ClipLoader color='white' size={50} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#DFE0EE]">
      {!isAuthPage && <Navbar />}

      <main className="grow relative pb-14">
        <Routes>
          <Route path='/' element={userData ? <Home /> : <Navigate to={'/signin'} />} />
          <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={'/'} />} />
          <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to={'/'} />} />
          <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <Navigate to="/" />} />
          <Route path='/state/:slug' element={userData ? <StateDetails /> : <Navigate to={'/signin'} />} />
          <Route path='/city/:cityId' element={userData ? <CityDetails /> : <Navigate to={'/signin'} />} />

          {/* === NEW ADMIN NESTED ROUTES === */}
          <Route
            path='/admin'
            element={userData?.role === 'admin' ? <AdminDashboard /> : <Navigate to={'/'} />}
          >
            {/* If user visits /admin, automatically redirect them to /admin/add-state */}
            <Route index element={<Navigate to="add-state" replace />} />

            {/* This renders inside the <Outlet /> of AdminDashboard */}
            <Route path='add-state' element={<AddState />} />
            <Route path='add-city' element={<AddCity />} />
            <Route path='add-place' element={<AddTouristPlace />} />
            {/* Placeholders for tomorrow */}
            {/* <Route path='add-place' element={<AddTouristPlace />} /> */}
          </Route>

        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;