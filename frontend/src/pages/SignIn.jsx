import React, { useState } from 'react';
import { ClipLoader } from "react-spinners";
import axios from 'axios';
import { serverUrl } from '../App';
import { useNavigate, Link } from 'react-router-dom';
import { LuArrowLeft, LuEye, LuEyeClosed } from "react-icons/lu";
import travelBharatLogo_darkTheme from '../assets/TravelBharat_darkBG_img.png';
import travelBharatLogo_whiteTheme from '../assets/TravelBharat_whitBG_img.png';
import { PiLockOpenThin } from "react-icons/pi";
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';


const SignIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Track focus for floating labels
    const [focused, setFocused] = useState({
        email: false,
        password: false
    });

    const [showPassword, setShowPassword] = useState(false);

    // Form states matching your backend controller

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const handleSignin = async () => {
        if (!email || !password) {
            setErr("Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            setErr("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        setErr("");

        try {
            const result = await axios.post(`${serverUrl}/api/auth/signin`, {
                email, password
            }, { withCredentials: true });

            dispatch(setUserData(result.data)); // Set the user data in Redux
            console.log("User signed in successfully:", result.data);
            navigate('/'); // Redirect after signin

        } catch (error) {
            setErr(error.response?.data?.message || "An error occurred during sign in.");
            console.error("Signin error:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='w-full min-h-screen bg-linear-to-b from-[#babefe] to-[#e0e1ed] flex flex-col justify-center items-center py-10 px-4'>

            {/* Main Split Container */}
            <div className='w-[90%] lg:max-w-250 bg-[#e6f8e9] rounded-2xl flex justify-center overflow-hidden border-2 border-gray-400 shadow-2xl'>

                {/* Left Side: Form */}
                <div className='w-full lg:w-[50%] flex flex-col items-center p-6 sm:p-10'>

                    {/* Header */}
                    <div className='flex items-center w-full justify-start mb-2'>
                        <button onClick={() => navigate('/')} className='mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors'>
                            <LuArrowLeft size={28} className="text-gray-500" />
                        </button>
                        <div className='flex gap-2.5 items-center font-bold'>
                            <h2 className='text-[20px] sm:text-[28px] font-bold text-black'>Sign In</h2>
                            <PiLockOpenThin className='text-[27px] sm:text-[32px] text-green-700' />
                        </div>
                    </div>

                    <p className='text-gray-700 mb-8 w-full text-left ml-14 sm:ml-16 text-sm sm:text-base'>
                        Join to explore India's beautiful destinations.
                    </p>


                    {/* Email Field */}
                    <div className='relative flex items-center w-full h-14 rounded-2xl border-2 border-gray-500 mb-6 focus-within:border-green-600 transition-colors'>
                        <label
                            htmlFor='email'
                            className={`absolute left-4 px-1 bg-[#e6f8e9] transition-all duration-200 ${(focused.email || email)
                                ? "-top-3 text-xs sm:text-sm font-semibold text-green-600"
                                : "top-3.5 text-gray-600 text-sm sm:text-base pointer-events-none"
                                }`}
                        >
                            Email Address
                        </label>
                        <input
                            type="email" id='email'
                            className='w-full h-full rounded-2xl px-5 outline-none border-0 text-sm sm:text-base bg-transparent text-black'
                            required value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocused({ ...focused, email: true })}
                            onBlur={() => setFocused({ ...focused, email: false })}
                        />
                    </div>

                    {/* Password Field */}
                    <div className='relative flex items-center w-full h-14 rounded-2xl border-2 border-gray-500 mb-6 focus-within:border-green-600 transition-colors'>
                        <label
                            htmlFor='password'
                            className={`absolute left-4 px-1 bg-[#e6f8e9] transition-all duration-200 ${(focused.password || password)
                                ? "-top-3 text-xs sm:text-sm font-semibold text-green-600"
                                : "top-3.5 text-gray-600 text-sm sm:text-base pointer-events-none"
                                }`}
                        >
                            Password (min. 6 characters)
                        </label>
                        <input
                            type={showPassword ? "text" : "password"} id='password'
                            className='w-full h-full rounded-2xl pl-5 pr-12 outline-none border-0 text-sm sm:text-base bg-transparent text-black'
                            required value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocused({ ...focused, password: true })}
                            onBlur={() => setFocused({ ...focused, password: false })}
                        />
                        {showPassword ? (
                            <LuEyeClosed className='absolute cursor-pointer right-4 text-gray-600 hover:text-black w-5 h-5 transition-colors' onClick={() => setShowPassword(false)} />
                        ) : (
                            <LuEye className='absolute cursor-pointer right-4 text-gray-600 hover:text-black w-5 h-5 transition-colors' onClick={() => setShowPassword(true)} />
                        )}

                        
                    </div>

                    <p><Link to="/forgot-password" className="text-orange-400 hover:underline font-semibold">Forgot Password?</Link></p>



                    {/* Error Message */}
                    {err && <p className='text-red-400 text-[14px] font-medium w-full text-left mb-4'>{err}</p>}

                    {/* Submit Button */}
                    <div className="flex flex-col items-center w-full mt-2">
                        <button
                            className='w-full px-5 py-3 bg-green-700 text-white hover:bg-green-600 transition-colors font-semibold h-14 cursor-pointer rounded-2xl flex justify-center items-center disabled:bg-gray-600'
                            disabled={loading}
                            onClick={handleSignin}
                        >
                            {loading ? <ClipLoader color='white' size={25} /> : "Sign In"}
                        </button>

                        <p className="text-gray-700 mt-5 text-sm">
                            Don't Have an Account? <Link to="/signup" className="text-green-600 hover:underline font-semibold">Sign Up</Link>
                        </p>
                    </div>
                </div>

                {/* Right Side: Branding Section (Hidden on Mobile/Tablet) */}
                <div className='hidden lg:flex w-[50%] justify-center items-center bg-[#FDFDFD] flex-col gap-4 text-black text-[16px] font-semibold border-l-2 border-gray-400 shadow-inner'>
                    <img
                        src={travelBharatLogo_whiteTheme}
                        alt="TravelBharat Logo"
                        className='w-[60%] hover:scale-105 transition-all duration-300'
                    />
                    <p className='text-gray-700 tracking-wide mt-2'>Explore India State by State</p>
                </div>

            </div>
        </div>
    );
}

export default SignIn;