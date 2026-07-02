import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
import CityCard from '../components/CityCard';
import { LuArrowLeft } from 'react-icons/lu';

const StateDetails = () => {
    const { slug } = useParams(); // Grabs the dynamic part of the URL
    const navigate = useNavigate();
    
    const [stateData, setStateData] = useState(null);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStateAndCities = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/explore/state/${slug}`, {
                    withCredentials: true
                });
                setStateData(response.data.state);
                setCities(response.data.cities);
            } catch (error) {
                console.error("Error fetching state details:", error);
                // If the state doesn't exist, send them back home
                navigate('/'); 
            } finally {
                setLoading(false);
            }
        };

        fetchStateAndCities();
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="w-full min-h-[70vh] flex justify-center items-center">
                <ClipLoader color="#16a34a" size={50} />
            </div>
        );
    }

    if (!stateData) return null;

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

            {/* Cities Grid Section */}
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-gray-900">Cities to Explore</h2>
                    <p className="text-gray-500 mt-2 text-lg">Discover the best destinations across {stateData.name}.</p>
                </div>

                {cities.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {cities.map((city) => (
                            <CityCard key={city._id} city={city} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No cities added yet.</h3>
                        <p className="text-gray-500">Check back later or head to the admin dashboard to populate this state!</p>
                    </div>
                )}
            </div>
            
        </div>
    );
};

export default StateDetails;