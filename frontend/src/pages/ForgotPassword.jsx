import axios from 'axios';
import React, { useState } from 'react';
import { ClipLoader } from "react-spinners";
import { serverUrl } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import { LuEye } from "react-icons/lu";
import { LuEyeClosed } from "react-icons/lu";
import { PiLockOpenThin } from "react-icons/pi";
import travelBharatLogo_whiteTheme from '../assets/TravelBharat_whitBG_img.png';


const ForgotPassword = () => {

    const [step, setStep] = useState(1);
    const [inputClicked, setInputClicked] = useState({
        Email: false,
        Otp: false,
        NewPassword: false,
        ConfirmPassword: false
    });

    const [showPassword, setShowPassword] = useState(false);

    //state for showing the loading spinner
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();


    // This is for step 1 where we send the otp to the user email
    const handleStep1 = async () => {
        try {

            setLoading(true);
            setErr("");

            const result = await axios.post(`${serverUrl}/api/auth/send-otp`, { email }, { withCredentials: true });
            //console.log(result.data);

            setSuccess("OTP sent successfully to your email.");
            setStep(2);

            setLoading(false);
        } catch (error) {

            setErr(error.response.data.message || "Error sending OTP");
            console.error("Error sending OTP:", error);
            setLoading(false);
        }
    }

    // This is for step 2 where we verify the otp entered by user
    const handleStep2 = async () => {
        try {
            setLoading(true);
            setErr("");

            const result = await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp }, { withCredentials: true });
            //console.log(result.data);
            setStep(3);

            setLoading(false);
        } catch (error) {

            setErr(error?.response?.data?.message || "Error verifying OTP");
            console.error("Error verifying OTP:", error);
            setLoading(false);
        }
    }

    // This is for step 3 where we set the new password after otp verification
    const handleStep3 = async () => {
        try {
            setLoading(true);
            setErr("");

            if (newPassword !== confirmPassword) {

                console.log("Password does't match !");
                setErr("Password does't match !");
                setLoading(false);
                return;
            }

            const result = await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword }, { withCredentials: true });
            //console.log(result.data);

            setLoading(false);
            // Handle successful password reset (e.g., redirect to login page)
            navigate('/signin'); // Redirect to the login page after successful password reset
        } catch (error) {

            setErr(error?.response?.data?.message || "Error resetting password");
            console.error("Error reset password:", error);
            setLoading(false);
        }
    }
    return (
        <div className='w-full min-h-screen bg-linear-to-b from-[#babefe] to-[#e0e1ed] flex justify-center items-center py-10 px-4'>

            <div className='w-[95%] max-w-5xl bg-[#e6f8e9] rounded-2xl flex overflow-hidden border-2 border-gray-400 shadow-2xl'>

                {/* Left Side */}
                <div className='w-full lg:w-[50%] flex flex-col justify-center items-center p-6 sm:p-10'>

                    {/* Add the Progress Indicator */}

                    <div className="w-full max-w-md mb-10 mt-2">

                        <div className="flex items-center justify-between">

                            {/* Step 1 */}
                            <div className="flex flex-col items-center transition-all duration-300">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                                        ${step >= 1
                                            ? "bg-green-700 text-white"
                                            : "bg-gray-300 text-gray-600"
                                        }`}
                                >
                                    1
                                </div>

                                <span className="text-xs sm:text-sm mt-2 text-gray-700">
                                    Email
                                </span>
                            </div>

                            <div
                                className={`flex-1 h-1 mx-2 rounded
                                ${step >= 2 ? "bg-green-700" : "bg-gray-300"}`}
                            />

                            {/* Step 2 */}
                            <div className="flex flex-col items-center transition-all duration-300">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                                        ${step >= 2
                                            ? "bg-green-700 text-white"
                                            : "bg-gray-300 text-gray-600"
                                        }`}
                                >
                                    2
                                </div>

                                <span className="text-xs sm:text-sm mt-2 text-gray-700">
                                    OTP
                                </span>
                            </div>

                            <div
                                className={`flex-1 h-1 mx-2 rounded
                                ${step >= 3 ? "bg-green-700" : "bg-gray-300"}`}
                            />

                            {/* Step 3 */}
                            <div className="flex flex-col items-center transition-all duration-300">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                                        ${step >= 3
                                            ? "bg-green-700 text-white"
                                            : "bg-gray-300 text-gray-600"
                                        }`}
                                >
                                    3
                                </div>

                                <span className="text-xs sm:text-sm mt-2 text-gray-700">
                                    Reset
                                </span>
                            </div>

                        </div>

                    </div>
                    {/* ---------------------------------------------------------------------------------------------------------- */}


                    {/* This Step 1 here we input gmail id where the otp was send */}
                    {step == 1 &&
                        <div className='w-full flex flex-col items-center'>
                            <div className='flex gap-2.5 items-center mb-2'>
                                <h2 className='text-[24px] sm:text-[28px] font-bold text-black'>
                                    Forgot Password
                                </h2>
                                <PiLockOpenThin className='text-[28px] sm:text-[32px] text-green-700' />
                            </div>

                            <p className='text-gray-700 text-center mb-8'>
                                Enter your email address to receive an OTP.
                            </p>

                            {/* This is for email field */}
                            <div className='relative flex items-center w-full h-14 rounded-2xl border-2 border-gray-500 mb-6 focus-within:border-green-600 transition-colors' onClick={() => setInputClicked({ ...inputClicked, Email: true })}>

                                <label
                                    htmlFor='email'
                                    className={`absolute left-4 px-1 bg-[#e6f8e9] transition-all duration-200 ${(inputClicked.Email || email)
                                        ? "-top-3 text-xs sm:text-sm font-semibold text-green-600"
                                        : "top-3.5 text-gray-600 text-sm sm:text-base pointer-events-none"
                                        }`}
                                >
                                    Enter your Email
                                </label>
                                <input type="email"
                                    id='email'
                                    className='w-full h-full rounded-2xl px-5 outline-none border-0 bg-transparent text-black' required value={email} onChange={(e) => setEmail(e.target.value)} />

                            </div>

                            {err && <p className='text-red-500 text-[14px]'>{err}</p>}

                            <button className='w-full px-5 py-3 bg-green-700 text-white hover:bg-green-600 transition-colors font-semibold h-14 cursor-pointer rounded-2xl flex justify-center items-center mt-2' disabled={loading} onClick={handleStep1}>
                                {loading ? <ClipLoader color='white' size={25} /> : "Send OTP"}
                            </button>

                            <div className='mt-5'>
                                <Link
                                    to="/signin"
                                    className="text-green-600 hover:underline font-semibold text-sm"
                                >
                                    ← Back to Sign In
                                </Link>
                            </div>
                        </div>}

                    {/* This is Step 2 here we enter and verify the Otp  */}
                    {step == 2 &&
                        <div className='w-full flex flex-col items-center'>
                            <div className='flex gap-2.5 items-center mb-2'>
                                <h2 className='text-[24px] sm:text-[28px] font-bold text-black'>
                                    Forgot Password
                                </h2>
                                <PiLockOpenThin className='text-[28px] sm:text-[32px] text-green-700' />
                            </div>

                            <p className='text-gray-700 text-center mb-8'>
                                Enter your OTP sent to your email address.
                            </p>

                            {success && (
                                <p className='text-green-700 text-sm text-center mb-4'>
                                    {success}
                                </p>
                            )}


                            {/* This is for OTP field */}
                            <div className='relative flex items-center w-full h-14 rounded-2xl border-2 border-gray-500 mb-6 focus-within:border-green-600 transition-colors' onClick={() => setInputClicked({ ...inputClicked, Otp: true })}>

                                <label
                                    htmlFor='otp'
                                    className={`absolute left-4 px-1 bg-[#e6f8e9] transition-all duration-200 ${(inputClicked.Otp || otp)
                                        ? "-top-3 text-xs sm:text-sm font-semibold text-green-600"
                                        : "top-3.5 text-gray-600 text-sm sm:text-base pointer-events-none"
                                        }`}
                                >
                                    Enter your OTP
                                </label>
                                <input type="email"
                                    id='otp'
                                    className='w-full h-full rounded-2xl px-5 outline-none border-0 bg-transparent text-black' required value={otp} onChange={(e) => setOtp(e.target.value)} />

                            </div>

                            {err && <p className='text-red-500 text-[14px]'>{err}</p>}

                            <button className='w-full px-5 py-3 bg-green-700 text-white hover:bg-green-600 transition-colors font-semibold h-14 cursor-pointer rounded-2xl flex justify-center items-center mt-2' disabled={loading} onClick={handleStep2}>
                                {loading ? <ClipLoader color='white' size={25} /> : "Verify OTP"}
                            </button>

                            <div className='mt-5'>
                                <Link
                                    to="/signin"
                                    className="text-green-600 hover:underline font-semibold text-sm"
                                >
                                    ← Back to Sign In
                                </Link>
                            </div>
                        </div>}


                    {/* This is Step 3 here we enter new password and confirm password  */}
                    {step == 3 &&
                        <div className='w-full flex flex-col items-center'>
                            <div className='flex gap-2.5 items-center mb-2'>
                                <h2 className='text-[24px] sm:text-[28px] font-bold text-black'>
                                    Reset Password
                                </h2>
                                <PiLockOpenThin className='text-[28px] sm:text-[32px] text-green-700' />
                            </div>

                            <p className='text-gray-700 text-center mb-8'>
                                Enter your new password and confirm it to reset your password.
                            </p>

                            {/* This is for new password field */}

                            <div className='relative flex items-center w-full h-14 rounded-2xl border-2 border-gray-500 mb-6 focus-within:border-green-600 transition-colors' onClick={() => setInputClicked({ ...inputClicked, NewPassword: true })}>

                                <label htmlFor='new-Password'
                                    className={`absolute left-4 px-1 bg-[#e6f8e9] transition-all duration-200 ${(inputClicked.NewPassword || newPassword)
                                        ? "-top-3 text-xs sm:text-sm font-semibold text-green-600"
                                        : "top-3.5 text-gray-600 text-sm sm:text-base pointer-events-none"
                                        }`}>Enter new Password</label>
                                <input type={showPassword ? "text" : "password"} id='new-Password' className='w-full h-full rounded-2xl px-5 outline-none border-0 bg-transparent text-black' required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

                                {showPassword ? <LuEyeClosed className='absolute cursor-pointer right-4 w-6.25 h-6.25' onClick={() => setShowPassword(false)} /> : <LuEye className='absolute cursor-pointer right-5 w-6.25 h-6.25' onClick={() => setShowPassword(true)} />}

                            </div>

                            {/* This is for confirm password field */}

                            <div className='relative flex items-center w-full h-14 rounded-2xl border-2 border-gray-500 mb-6 focus-within:border-green-600 transition-colors' onClick={() => setInputClicked({ ...inputClicked, ConfirmPassword: true })}>

                                <label htmlFor='confirm-Password'
                                    className={`absolute left-4 px-1 bg-[#e6f8e9] transition-all duration-200 ${(inputClicked.ConfirmPassword || confirmPassword)
                                        ? "-top-3 text-xs sm:text-sm font-semibold text-green-600"
                                        : "top-3.5 text-gray-600 text-sm sm:text-base pointer-events-none"
                                        }`}>Confirm new Password</label>
                                <input type={showPassword ? "text" : "password"} id='confirm-Password' className='w-full h-full rounded-2xl px-5 outline-none border-0 bg-transparent text-black' required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                                {showPassword ? <LuEyeClosed className='absolute cursor-pointer right-4 w-6.25 h-6.25' onClick={() => setShowPassword(false)} /> : <LuEye className='absolute cursor-pointer right-5 w-6.25 h-6.25' onClick={() => setShowPassword(true)} />}

                            </div>

                            {err && <p className='text-red-500 text-[14px]'>{err}</p>}

                            <button className='w-full px-5 py-3 bg-green-700 text-white hover:bg-green-600 transition-colors font-semibold h-14 cursor-pointer rounded-2xl flex justify-center items-center mt-2' disabled={loading} onClick={handleStep3}>
                                {loading ? <ClipLoader color='white' size={25} /> : "Set New Password"}
                            </button>

                            <div className='mt-5'>
                                <Link
                                    to="/signin"
                                    className="text-green-600 hover:underline font-semibold text-sm"
                                >
                                    ← Back to Sign In
                                </Link>
                            </div>
                        </div>}

                </div>

                {/* Right Branding Panel */}
                <div className='hidden lg:flex w-[50%] justify-center items-center bg-[#FDFDFD] flex-col gap-4 text-black text-[16px] font-semibold border-l-2 border-gray-400 shadow-inner'>

                    <img
                        src={travelBharatLogo_whiteTheme}
                        alt="TravelBharat Logo"
                        className='w-[50%] hover:scale-105 transition-all duration-300'
                    />

                    <p className='text-gray-700 tracking-wide mt-2'>
                        Explore India State by State
                    </p>

                </div>

            </div>



        </div>
    )
}

export default ForgotPassword