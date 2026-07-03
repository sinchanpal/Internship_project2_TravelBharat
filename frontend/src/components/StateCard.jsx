import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuArrowRight, LuPencil } from "react-icons/lu";
import { useSelector } from 'react-redux'; // Import Redux hook

const StateCard = ({ state }) => {
    const navigate = useNavigate();
    // Get the current user to check their role
    const { userData } = useSelector((state) => state.user);

    const fallbackImage = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop";

    const handleEditClick = (e) => {
        e.preventDefault(); // Prevents default link behavior
        e.stopPropagation(); // Stops the click from bubbling up to the card
        navigate(`/admin/edit-state/${state._id}`);
    };

    return (
        <Link
            to={`/state/${state?.slug}`}
            className="group relative h-64 w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block bg-gray-200"
        >
            {/* Background Image */}
            <img
                src={state?.coverImage || fallbackImage}
                alt={`${state?.name} tourism`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                onError={(e) => { e.target.src = fallbackImage }}
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100"></div>

            {/* CONDITIONAL ADMIN EDIT BUTTON */}
            {userData?.role === 'admin' && (
                <button
                    onClick={handleEditClick}
                    className="absolute top-4 right-4 z-20 bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                    title="Edit State"
                >
                    <LuPencil size={18} />
                </button>
            )}

            {/* Text & Icon Content */}
            <div className="absolute inset-0 p-5 flex flex-col justify-end pointer-events-none">
                <div className="flex items-end justify-between w-full">
                    <div>
                        <h3 className="text-white text-xl sm:text-2xl font-bold tracking-wide drop-shadow-md">
                            {state?.name}
                        </h3>
                        <p className="text-gray-300 text-sm mt-1 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                            {state?.description || "Explore destinations"}
                        </p>
                    </div>

                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        <LuArrowRight size={18} />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default StateCard;