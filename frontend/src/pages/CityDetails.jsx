import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
import TouristPlaceCard from '../components/TouristPlaceCard';
import { LuArrowLeft, LuMap } from 'react-icons/lu';

const CityDetails = () => {
    const { cityId } = useParams();
    const navigate = useNavigate();

    const [cityData, setCityData] = useState(null);
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCityAndPlaces = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/explore/places-by-city/${cityId}`, {
                    withCredentials: true
                });
                setCityData(response.data.city);
                setPlaces(response.data.places);
            } catch (error) {
                console.error("Error fetching city details:", error);
                navigate(-1); // Go back if city is not found
            } finally {
                setLoading(false);
            }
        };

        fetchCityAndPlaces();
    }, [cityId, navigate]);

    if (loading) {
        return (
            <div className="w-full min-h-[70vh] flex justify-center items-center">
                <ClipLoader color="#16a34a" size={50} />
            </div>
        );
    }

    if (!cityData) return null;

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col">

            {/* Dynamic Hero Section */}
            <div className="relative w-full h-[45vh] min-h-87.5 flex items-end pb-12">
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${cityData.coverImage})` }}
                >
                    <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/60 to-black/30"></div>
                </div>

                <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full w-fit text-sm font-medium"
                    >
                        <LuArrowLeft size={16} /> Back to State
                    </button>

                    {/* Breadcrumb indicating the parent state */}
                    {cityData.state && (
                        <div className="flex items-center gap-2 text-green-400 mb-2 text-sm font-bold uppercase tracking-widest">
                            <LuMap size={16} />
                            <span>{cityData.state.name}</span>
                        </div>
                    )}

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
                        {cityData.name}
                    </h1>
                    <p className="text-lg text-gray-200 max-w-3xl leading-relaxed font-medium drop-shadow-sm line-clamp-3">
                        {cityData.description}
                    </p>
                </div>
            </div>

            {/* Tourist Places Grid Section */}
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-gray-900">Top Attractions</h2>
                    <p className="text-gray-500 mt-2 text-lg">Uncover the best places to visit in {cityData.name}.</p>
                </div>

                {places.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {places.map((place) => (
                            <TouristPlaceCard key={place._id} place={place} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No places added yet.</h3>
                        <p className="text-gray-500 mb-6">Be the first to contribute to this city's travel encyclopedia!</p>
                        <Link
                            to="/contribute"
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
                        >
                            Contribute a Place
                        </Link>
                    </div>
                )}
            </div>

        </div>
    );
};

export default CityDetails;