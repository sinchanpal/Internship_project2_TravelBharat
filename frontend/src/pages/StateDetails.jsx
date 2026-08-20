import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
import TouristPlaceCard from '../components/TouristPlaceCard';
import { LuArrowLeft, LuSearch, LuFilter } from 'react-icons/lu';

const StateDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [stateData, setStateData] = useState(null);
    const [places, setPlaces] = useState([]); // Holds all fetched places
    const [filteredPlaces, setFilteredPlaces] = useState([]); // Holds the places currently displayed
    const [loading, setLoading] = useState(true);

    // Filter & Search states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // 1. Fetch Data
    useEffect(() => {
        const fetchStateAndPlaces = async () => {
            try {
                // Notice the API response now gives us 'places' instead of 'cities'
                const response = await axios.get(`${serverUrl}/api/explore/state/${slug}`, {
                    withCredentials: true
                });
                setStateData(response.data.state);
                setPlaces(response.data.places);
                setFilteredPlaces(response.data.places); // Initially show all places
            } catch (error) {
                console.error("Error fetching state details:", error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchStateAndPlaces();
    }, [slug, navigate]);

    // 2. Search & Filter Logic
    useEffect(() => {
        let result = places;

        // Filter by Category
        if (selectedCategory !== 'All') {
            result = result.filter(place => place.category.includes(selectedCategory));
        }

        // Search by Name or City
        if (searchQuery.trim() !== '') {
            const lowerCaseQuery = searchQuery.toLowerCase();
            result = result.filter(place =>
                place.name.toLowerCase().includes(lowerCaseQuery) ||
                place.city.toLowerCase().includes(lowerCaseQuery)
            );
        }

        setFilteredPlaces(result);
    }, [searchQuery, selectedCategory, places]);

    if (loading) {
        return (
            <div className="w-full min-h-[70vh] flex justify-center items-center">
                <ClipLoader color="#16a34a" size={50} />
            </div>
        );
    }

    if (!stateData) return null;

    const handleDeletePlace = (deletedPlaceId) => {
        setPlaces((prevPlaces) => prevPlaces.filter((place) => place._id !== deletedPlaceId));
        setFilteredPlaces((prevFiltered) => prevFiltered.filter((place) => place._id !== deletedPlaceId));
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col">

            {/* Dynamic Hero Section */}
            <div className="relative w-full h-[50vh] min-h-100 flex items-end pb-12">
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${stateData.coverImage})` }}
                >
                    <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/60 to-black/30"></div>
                </div>

                <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full w-fit text-sm font-medium"
                    >
                        <LuArrowLeft size={16} /> Back
                    </button>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
                        {stateData.name}
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-200 max-w-3xl leading-relaxed font-medium drop-shadow-sm">
                        {stateData.description}
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Search & Filter Toolbar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-10 flex flex-col sm:flex-row gap-4 justify-between items-center z-20 relative">

                    {/* Search Bar */}
                    <div className="relative w-full sm:max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <LuSearch className="text-gray-400" size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search places or cities (e.g., Gangtok, Puri)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 transition-all text-gray-900"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="relative w-full sm:w-auto min-w-50">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <LuFilter className="text-gray-400" size={18} />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="block w-full pl-11 pr-10 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 transition-all text-gray-900 appearance-none font-medium cursor-pointer"
                        >
                            <option value="All">All Categories</option>
                            <option value="Heritage">Heritage</option>
                            <option value="Nature">Nature</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Religious">Religious</option>
                        </select>
                    </div>
                </div>

                {/* Tourist Places Grid */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Top Destinations</h2>
                    <p className="text-gray-500 mt-2 text-lg">
                        Showing {filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'} to explore in {stateData.name}.
                    </p>
                </div>

                {filteredPlaces.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredPlaces.map((place) => (
                            <TouristPlaceCard key={place._id} place={place} onDeleteSuccess={handleDeletePlace}/>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No destinations found.</h3>
                        <p className="text-gray-500">
                            {searchQuery || selectedCategory !== 'All'
                                ? "Try adjusting your search or filter criteria."
                                : `Be the first to add a tourist place for ${stateData.name}!`}
                        </p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default StateDetails;