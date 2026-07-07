import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuMapPin, LuTags, LuPencil } from "react-icons/lu";
import { useSelector } from 'react-redux'; // <-- Import this

const TouristPlaceCard = ({ place }) => {
    const navigate = useNavigate();
    // <-- Get user data
    const { userData } = useSelector((state) => state.user);
    const fallbackImage = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&auto=format&fit=crop";

    const getCategoryColor = (category) => {
        // ... (Keep your existing color switch statement)
        switch (category) {
            case 'Heritage': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Nature': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Adventure': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Religious': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    // <-- Add this function
    const handleEditClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/admin/edit-place/${place.slug}`);
    };

    return (
        <Link
            to={`/place/${place.slug}`}
            className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
        >
            <div className="relative h-56 w-full overflow-hidden bg-gray-200">
                <img
                    src={place?.coverImage || fallbackImage}
                    alt={`${place?.name}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    onError={(e) => { e.target.src = fallbackImage }}
                />

                {/* CONDITIONAL ADMIN EDIT BUTTON */}
                {userData?.role === 'admin' && (
                    <button
                        onClick={handleEditClick}
                        className="absolute top-4 left-4 z-20 bg-amber-500 hover:bg-amber-600 text-white p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                        title="Edit Destination"
                    >
                        <LuPencil size={16} />
                    </button>
                )}

                <div className="absolute top-4 right-4 z-10">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border flex items-center gap-1 shadow-sm backdrop-blur-md bg-opacity-90 ${getCategoryColor(place?.category[0])}`}>
                        <LuTags size={12} />
                        {place?.category[0]}
                    </span>
                </div>
            </div>

            <div className="p-5 flex flex-col grow">
                <div className="flex items-center gap-1.5 text-green-600 mb-2">
                    <LuMapPin size={16} />
                    <span className="text-sm font-semibold">{place?.city}</span>
                </div>

                <h3 className="text-gray-900 text-xl font-bold tracking-tight mb-2 group-hover:text-green-600 transition-colors">
                    {place?.name}
                </h3>

                <p className="text-gray-500 text-sm line-clamp-3">
                    {place?.description}
                </p>
            </div>
        </Link>
    );
};

export default TouristPlaceCard;