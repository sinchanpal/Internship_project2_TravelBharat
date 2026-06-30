import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LuMenu, LuX, LuUser, LuLogOut, LuShieldAlert } from "react-icons/lu";
import { setUserData } from '../redux/userSlice';
import axios from 'axios';
import { serverUrl } from '../App';
import travelBharatLogo_whiteTheme from '../assets/TravelBharat_whitBG_img.png';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    // Grab the user data from your Redux store
    const { userData } = useSelector((state) => state.user);

    const handleSignOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
            dispatch(setUserData(null)); // Clear Redux state
            setIsProfileDropdownOpen(false);
            navigate('/signin');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">

                    {/* Left: Logo & Brand */}
                    <div className="flex items-center">
                        <Link to="/" className="shrink-0 flex items-center gap-2">
                            {/* Replace with your actual logo image if you prefer */}
                            <span className="text-2xl font-bold text-gray-900 tracking-tight">

                                <img src={travelBharatLogo_whiteTheme} alt="TravelBharat Logo" className="h-10 w-auto" />

                            </span>
                            <p className='text-green-700'>Travel<span className="text-orange-600">Bharat</span></p>
                        </Link>
                    </div>

                    {/* Center: Desktop Navigation Links */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors">Home</Link>
                        <Link to="/explore" className="text-gray-600 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors">Explore</Link>
                    </div>

                    {/* Right: Auth Buttons & Profile */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {!userData ? (
                            // Logged OUT State
                            <>
                                <Link to="/signin" className="text-gray-600 hover:text-gray-900 font-medium text-sm px-4 py-2">Sign In</Link>
                                <Link to="/signup" className="bg-green-600 hover:bg-green-700 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm">Sign Up</Link>
                            </>
                        ) : (
                            // Logged IN State
                            <div className="flex items-center space-x-4">

                                {/* Admin Button OR Contribute Button */}
                                {userData.role === 'admin' ? (
                                    <Link to="/admin" className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                                        <LuShieldAlert size={16} /> Dashboard
                                    </Link>
                                ) : (
                                    <Link to="/contribute" className="text-green-600 border border-green-600 hover:bg-green-50 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                                        Contribute
                                    </Link>
                                )}

                                {/* Profile Dropdown Toggle */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                                            {/* Display first letter of user's name */}
                                            {userData.name ? userData.name.charAt(0).toUpperCase() : <LuUser />}
                                        </div>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isProfileDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 border border-gray-100">
                                            <div className="px-4 py-4 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900 truncate">{userData.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                                            </div>
                                            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600">Your Profile</Link>
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                            >
                                                <LuLogOut size={16} /> Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                        >
                            {isMobileMenuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu (Dropdown) */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-200">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link to="/" className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:bg-gray-50 hover:border-green-500 text-base font-medium text-gray-600">Home</Link>
                        <Link to="/explore" className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:bg-gray-50 hover:border-green-500 text-base font-medium text-gray-600">Explore</Link>
                    </div>

                    {!userData ? (
                        <div className="pt-4 pb-3 border-t border-gray-200 px-4 flex flex-col gap-3">
                            <Link to="/signin" className="w-full text-center text-gray-600 font-medium py-2">Sign In</Link>
                            <Link to="/signup" className="w-full text-center bg-green-600 text-white font-medium py-2 rounded-xl">Sign Up</Link>
                        </div>
                    ) : (
                        <div className="pt-4 pb-3 border-t border-gray-200">
                            <div className="flex items-center px-4 mb-3">
                                <div className="shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
                                    {userData.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">{userData.name}</div>
                                    <div className="text-sm font-medium text-gray-500">{userData.email}</div>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1">
                                {userData.role === 'admin' ? (
                                    <Link to="/admin" className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Admin Dashboard</Link>
                                ) : (
                                    <Link to="/contribute" className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Contribute a Place</Link>
                                )}
                                <Link to="/profile" className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Your Profile</Link>
                                <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50">Sign Out</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;