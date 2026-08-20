import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import PopularStates from '../components/PopularStates';
import FeaturedPlaces from '../components/FeaturedPlaces';

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
                <PopularStates />

                {/* 4. Placeholder: Featured Destinations */}
                <FeaturedPlaces />

            </div>
        </div>
    );
};

export default Home;