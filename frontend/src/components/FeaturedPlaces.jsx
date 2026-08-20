import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
import { LuMapPin, LuStar, LuArrowRight } from 'react-icons/lu';

const FeaturedPlaces = () => {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedPlaces = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/explore/featured`, {
                    withCredentials: true
                });

                if (response.data.success) {
                    setPlaces(response.data.places);
                }
            } catch (error) {
                console.error("Error fetching featured places:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedPlaces();
    }, []);

    // Display a loader while fetching data
    if (loading) {
        return (
            <div className="w-full flex justify-center items-center py-12">
                <ClipLoader color="#16a34a" size={40} />
            </div>
        );
    }

    // If there are no approved places yet, we simply hide the section
    if (places.length === 0) {
        return null;
    }

    return (
        <section>
            <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Featured Tourist Spots
                </h2>
                <p className="text-gray-500 text-sm sm:text-base mt-2">
                    Handpicked destinations loved by our community, featuring outstanding views and rich heritage.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {places.map((place) => (
                    <div key={place._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col">

                        {/* Image & Badges */}
                        <div className="relative h-56 overflow-hidden">
                            <img
                                src={place.coverImage}
                                alt={place.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Category Badge */}
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-700 shadow-sm uppercase tracking-wider">
                                {place.category[0]}
                            </div>

                            {/* Rating Badge (Only displays if it has reviews) */}
                            {place.averageRating > 0 && (
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1">
                                    <LuStar className="text-yellow-500 fill-yellow-500" size={14} />
                                    {place.averageRating}
                                </div>
                            )}
                        </div>

                        {/* Text Content */}
                        <div className="p-6 flex flex-col grow">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{place.name}</h3>
                            <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4 font-medium">
                                <LuMapPin size={16} className="text-green-500" />
                                <span>{place.city}, {place.state?.name}</span>
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-6 leading-relaxed">
                                {place.description}
                            </p>

                            {/* Action Button */}
                            <div className="mt-auto">
                                <Link
                                    to={`/place/${place.slug}`}
                                    className="inline-flex items-center justify-center gap-2 w-full bg-gray-50 hover:bg-green-600 text-gray-700 hover:text-white px-4 py-3 rounded-xl font-semibold transition-colors border border-gray-200 hover:border-transparent"
                                >
                                    View Details <LuArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedPlaces;