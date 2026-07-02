import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LuSearch, LuMapPin } from 'react-icons/lu';
import heroBG_image from '../assets/heroBG_image.jpg';

const HeroSection = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Grab user data to personalize the greeting
    const { userData } = useSelector((state) => state.user);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Later, your Explore page will catch this URL parameter to filter results
            navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    // A beautiful landscape image of India (Munnar/Kerala style) for the background
    //const bgImage = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop";

    return (
        <div className="relative w-full h-[70vh] min-h-125 flex items-center justify-center">

            {/* Background Image with Dark Overlay */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${heroBG_image})` }}
            >
                {/* The overlay ensures white text remains readable regardless of the background image */}
                <div className="absolute inset-0 bg-black/45"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

                {/* Dynamic Greeting */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
                    {userData ? (
                        <>Welcome back, <span className="text-green-400">{userData.name.split(' ')[0]}</span>!</>
                    ) : (
                        <>Discover the <span className="text-green-400">Beauty of India</span></>
                    )}
                </h1>

                {/* Subtitle */}
                <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl drop-shadow-md font-medium">
                    Explore states, uncover hidden gems, and dive into the rich heritage of incredible destinations state by state.
                </p>

                {/* Floating Search Bar */}
                <form
                    onSubmit={handleSearch}
                    className="w-full max-w-3xl bg-white p-2 rounded-full shadow-2xl flex items-center gap-2 transition-transform focus-within:scale-[1.02] duration-300"
                >
                    <div className="pl-4 text-gray-400 hidden sm:block">
                        <LuMapPin size={24} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by state, city, or category..."
                        className="grow bg-transparent border-none outline-none px-4 py-3 text-gray-800 text-base sm:text-lg w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 rounded-full font-semibold transition-colors flex items-center gap-2 h-full cursor-pointer"
                    >
                        <LuSearch size={20} />
                        <span className="hidden sm:inline">Search</span>
                    </button>
                </form>

                {/* Quick Suggestion Pills */}
                <div className="mt-8 flex flex-wrap justify-center items-center gap-3 text-sm font-medium">
                    <span className="text-gray-200 shadow-sm mr-1">Popular:</span>
                    {['Sikkim', 'Beaches', 'Rajasthan', 'Heritage'].map((tag, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setSearchQuery(tag)}
                            className="text-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-1.5 rounded-full transition-colors border border-white/30 cursor-pointer"
                        >
                            {tag}
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default HeroSection;