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
import StateDetails from './pages/StateDetails';
import AddTouristPlace from './pages/adminPages/AddTouristPlace';
import EditState from './pages/adminPages/EditState';
import PlaceDetails from './pages/PlaceDetails';
import EditTouristPlace from './pages/adminPages/EditTouristPlace';
import SubmitPlace from './pages/SubmitPlace';
import PendingApprovals from './pages/adminPages/PendingApprovals';
import Explore from './pages/Explore';



export const serverUrl = import.meta.env.VITE_SERVER_URL;
//'http://localhost:8000' this is for local development, but in production, it will use rendered backend URL from environment variable.
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
          <Route path='/place/:slug' element={userData ? <PlaceDetails /> : <Navigate to={'/signin'} />} />
          <Route path='/submit-place' element={userData ? <SubmitPlace /> : <Navigate to={'/signin'} />} />
          <Route path='/explore' element={userData ? <Explore /> : <Navigate to={'/signin'} />} />


          {/* ===  ADMIN NESTED ROUTES === */}
          <Route
            path='/admin'
            element={userData?.role === 'admin' ? <AdminDashboard /> : <Navigate to={'/'} />}
          >
            {/* If user visits /admin, automatically redirect them to /admin/add-state */}
            <Route index element={<Navigate to="add-state" replace />} />

            {/* This renders inside the <Outlet /> of AdminDashboard */}
            <Route path='add-state' element={<AddState />} />
            <Route path='add-place' element={<AddTouristPlace />} />
            <Route path='edit-state/:id' element={<EditState />} />
            <Route path='edit-place/:slug' element={<EditTouristPlace />} />
            <Route path='pending-places' element={<PendingApprovals />} />

          </Route>

        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;