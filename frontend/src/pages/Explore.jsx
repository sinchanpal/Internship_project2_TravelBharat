import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
import { LuMapPin, LuArrowRight, LuSearchX } from 'react-icons/lu';
import InteractiveStateMap from '../components/InteractiveStateMap';

const Explore = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Read parameters from URL
    const searchQuery = searchParams.get('search');
    const categoryQuery = searchParams.get('category');

    const [states, setStates] = useState([]);
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                // Build query params based on what is in the URL
                const params = {};
                if (searchQuery) params.q = searchQuery;
                if (categoryQuery) params.category = categoryQuery;

                const response = await axios.get(`${serverUrl}/api/explore/search`, {
                    params,
                    withCredentials: true
                });

                setStates(response.data.states || []);
                setPlaces(response.data.places || []);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };

        // Only run fetch if we have a query parameter
        if (searchQuery || categoryQuery) {
            fetchResults();
        } else {
            // If user goes to /explore directly without params, we can just show empty or redirect
            setLoading(false);
        }
    }, [searchQuery, categoryQuery]);

    // UI Helper: Render dynamic title
    const renderTitle = () => {
        if (searchQuery) return <span>Search results for <span className="text-green-600">"{searchQuery}"</span></span>;
        if (categoryQuery) return <span>Exploring <span className="text-green-600">{categoryQuery}</span> Destinations</span>;
        return "Explore Destinations";
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl w-full mx-auto">

                {/* Header Section */}
                <div className="mb-10 flex items-center justify-between flex-wrap gap-4 border-b border-gray-200 pb-6">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        {renderTitle()}
                    </h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white border border-gray-200 text-gray-700 px-5 py-2 rounded-full font-medium hover:bg-gray-50 transition-colors shadow-sm text-sm"
                    >
                        Go Back
                    </button>
                </div>


                <InteractiveStateMap
                    onSelectState={(slug) => navigate(`/state/${slug}`)}
                />

                {loading ? (
                    <div className="w-full h-[50vh] flex justify-center items-center">
                        <ClipLoader color="#16a34a" size={50} />
                    </div>
                ) : (
                    <div className="mt-5 space-y-12">

                        {/* Empty State */}
                        {/* {states.length === 0 && places.length === 0 && (
                            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                                <LuSearchX className="text-gray-300 w-24 h-24 mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">No destinations found</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    We couldn't find any states or places matching your search. Try using different keywords or browsing our categories.
                                </p>
                            </div>
                        )} */}

                        {/* States Results */}
                        {states.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    States Found
                                    <span className="bg-green-100 text-green-700 text-sm py-1 px-3 rounded-full font-bold">{states.length}</span>
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {states.map((state) => (
                                        <Link to={`/state/${state.slug}`} key={state._id} className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block">
                                            <img src={state.coverImage} alt={state.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                                <h3 className="text-2xl font-bold text-white tracking-wide">{state.name}</h3>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Places Results */}
                        {places.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    Tourist Spots Found
                                    <span className="bg-green-100 text-green-700 text-sm py-1 px-3 rounded-full font-bold">{places.length}</span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {places.map((place) => (
                                        <div key={place._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col">
                                            <div className="relative h-56 overflow-hidden">
                                                <img src={place.coverImage} alt={place.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-700 shadow-sm uppercase tracking-wider">
                                                    {place.category[0]}
                                                </div>
                                            </div>
                                            <div className="p-6 flex flex-col grow">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{place.name}</h3>
                                                <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4 font-medium">
                                                    <LuMapPin size={16} className="text-green-500" />
                                                    <span>{place.city}, {place.state?.name}</span>
                                                </div>
                                                <p className="text-gray-600 text-sm line-clamp-2 mb-6 leading-relaxed">
                                                    {place.description}
                                                </p>
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
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Explore;