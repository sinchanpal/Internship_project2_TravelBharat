import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';

export const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'

function App() {

  return (


    <div className="min-h-screen relative pb-14 bg-[#DFE0EE]">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
      </Routes>

    </div>

  )
}

export default App
