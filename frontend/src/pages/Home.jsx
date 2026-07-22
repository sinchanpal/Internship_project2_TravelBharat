import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import PopularStates from '../components/PopularStates';

const Home = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        navigate(`/explore?category=${encodeURIComponent(category)}`);
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 text-gray-800 flex flex-col">

            {/* 1. Hero & Search Banner */}
            <HeroSection />

            {/* Main Content Container */}
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-16">

                {/* 2. Category Selector */}
                <section className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Browse by Interest
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base mb-6">
                        Filter unique experiences across diverse landscape types and heritage sites.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['Heritage', 'Nature', 'Adventure', 'Religious'].map((cat) => (
                            <span
                                key={cat}
                                onClick={() => handleCategoryClick(cat)}
                                className="bg-white border border-gray-200 shadow-sm px-6 py-3 rounded-full font-medium text-sm text-gray-700 hover:border-green-500 hover:text-green-600 transition-colors cursor-pointer"
                            >
                                {cat}
                            </span>
                        ))}
                    </div>
                </section>

                {/* 3. Explore by State Grid */}
                <PopularStates/>
                
                {/* 4. Placeholder: Featured Destinations */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Featured Tourist Spots
                        </h2>
                        <p className="text-gray-500 text-sm sm:text-base mt-1">
                            Handpicked destinations with outstanding historical significance and natural views.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2].map((item) => (
                            <div
                                key={item}
                                className="h-64 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 font-medium hover:shadow-md transition-shadow"
                            >
                                Destination Card Placeholder
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Home;