import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
import { LuArrowLeft, LuMapPin, LuCalendar, LuClock, LuMap, LuExternalLink, LuTags } from 'react-icons/lu';

const PlaceDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlaceDetails = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/explore/place/${slug}`, {
                    withCredentials: true
                });
                setPlace(response.data.place);
            } catch (error) {
                console.error("Error fetching place details:", error);
                navigate(-1); // Go back if not found
            } finally {
                setLoading(false);
            }
        };

        fetchPlaceDetails();
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="w-full min-h-[70vh] flex justify-center items-center">
                <ClipLoader color="#16a34a" size={50} />
            </div>
        );
    }

    if (!place) return null;

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col pb-20">

            {/* Hero Section */}
            <div className="relative w-full h-[60vh] min-h-112.5 flex items-end pb-12">
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${place.coverImage})` }}
                >
                    <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/60 to-black/20"></div>
                </div>

                <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full w-fit text-sm font-medium"
                    >
                        <LuArrowLeft size={16} /> Back
                    </button>

                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="bg-green-500/90 backdrop-blur text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1 shadow-sm">
                            <LuTags size={12} /> {place.category[0]}
                        </span>
                        <div className="flex items-center gap-1.5 text-green-400 text-sm font-bold uppercase tracking-widest">
                            <LuMapPin size={16} />
                            <span>{place.city}, {place.state?.name}</span>
                        </div>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">
                        {place.name}
                    </h1>
                </div>
            </div>

            {/* Main Content & Sidebar Layout */}
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Left Column: The Story & Main Details (65%) */}
                    <div className="w-full lg:w-2/3 space-y-10">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Destination</h2>
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                                {place.description}
                            </p>
                        </div>

                        {/* Future Image Gallery Section */}
                        {place.images && place.images.length > 0 && (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {place.images.map((img, index) => (
                                        <img key={index} src={img} alt="Gallery item" className="rounded-xl w-full h-48 object-cover" />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Sticky Essential Info Sidebar (35%) */}
                    <div className="w-full lg:w-1/3">
                        <div className="sticky top-24 bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-8">
                            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Essential Information</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 mt-1">
                                        <LuCalendar size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Best Time to Visit</h4>
                                        <p className="text-gray-900 font-medium text-lg">{place.bestTimeToVisit}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-amber-50 p-3 rounded-2xl text-amber-600 mt-1">
                                        <LuClock size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Timings & Fees</h4>
                                        <p className="text-gray-900 font-medium text-lg">{place.entryFeesAndTimings}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-green-50 p-3 rounded-2xl text-green-600 mt-1">
                                        <LuMap size={24} />
                                    </div>
                                    <div className="w-full">
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Location</h4>
                                        <a
                                            href={place.locationMapLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 w-full justify-center bg-gray-900 hover:bg-black text-white px-4 py-3 rounded-xl transition-colors font-semibold mt-2"
                                        >
                                            View on Google Maps <LuExternalLink size={18} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default PlaceDetails;