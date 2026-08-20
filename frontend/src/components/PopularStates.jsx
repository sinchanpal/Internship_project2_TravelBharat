import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import StateCard from './StateCard';
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { ClipLoader } from 'react-spinners';

const PopularStates = () => {
    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(true);

    // Reference to the scrollable container
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/explore/get-all-states`, {
                    withCredentials: true
                });
                setStates(response.data.states);
            } catch (error) {
                console.error("Error fetching states:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStates();
    }, []);

    // Function to handle the smooth scrolling
    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            // Adjust the 350 value to scroll more or less per click
            const scrollAmount = direction === 'left' ? -350 : 350;
            scrollContainerRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <ClipLoader color="#16a34a" size={40} />
            </div>
        );
    }

    const handleDeletePlace = (deletedStateId) => {
        setStates((prevStates) => prevStates.filter((state) => state._id !== deletedStateId));
       
    };

    return (
        <section className="relative w-full">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Explore States & UTs
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base mt-1">
                        Select a state to find local cities and unique destinations.
                    </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 hover:text-green-600 transition-colors focus:outline-none"
                    >
                        <LuChevronLeft size={24} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 hover:text-green-600 transition-colors focus:outline-none"
                    >
                        <LuChevronRight size={24} />
                    </button>
                </div>
            </div>

            {/* Scrollable Container */}
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hides scrollbar in Firefox/IE
            >

                {states.length > 0 ? (
                    states.map((state) => (
                        <div key={state._id} className="min-w-70 sm:min-w-[320px] shrink-0 snap-start">
                            <StateCard state={state} onDeleteSuccess={handleDeletePlace}/>
                        </div>
                    ))
                ) : (
                    <div className="w-full text-center py-10 text-gray-500 font-medium bg-white rounded-2xl border border-gray-100">
                        No states added yet. Head to the admin dashboard to add some!
                    </div>
                )}
            </div>
        </section>
    );
};

export default PopularStates;