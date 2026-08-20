import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import toast from 'react-hot-toast';
import { LuMapPin } from "react-icons/lu";
import { LuTags } from "react-icons/lu";
import { LuPencil } from "react-icons/lu";
import { LuTrash2 } from "react-icons/lu";
import { LuSettings } from "react-icons/lu";

const TouristPlaceCard = ({ place, onDeleteSuccess }) => {
    const navigate = useNavigate();
    const { userData } = useSelector((state) => state.user);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

   
    
    const fallbackImage = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&auto=format&fit=crop";

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Heritage': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Nature': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Adventure': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Religious': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const handleEditClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuOpen(false);
        navigate(`/admin/edit-place/${place.slug}`);
    };

    const handleDeleteClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuOpen(false);

        if (window.confirm(`Are you sure you want to delete ${place.name}?`)) {
            try {
                const response = await axios.delete(`${serverUrl}/api/admin/place/${place._id}`, {
                    withCredentials: true
                });

                if (response.data.success) {
                    toast.success(response.data.message);
                    if (onDeleteSuccess) onDeleteSuccess(place._id);
                }
            } catch (error) {
                console.error("Delete error:", error);
                toast.error(error.response?.data?.message || "Failed to delete tourist place");
            }
        }
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

                {/* CONDITIONAL ADMIN SETTINGS MENU */}
                {userData?.role === 'admin' && (
                    <div className="absolute top-4 left-4 z-30" ref={menuRef}>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setMenuOpen(!menuOpen);
                            }}
                            className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
                            title="Admin Settings"
                        >
                            <LuSettings size={18} />
                        </button>

                        {/* Dropdown Menu */}
                        {menuOpen && (
                            <div className="absolute left-0 mt-2 w-36 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 py-1 z-40">
                                <button
                                    onClick={handleEditClick}
                                    className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <LuPencil size={14} className="text-amber-500" /> Edit Place
                                </button>
                                <button
                                    onClick={handleDeleteClick}
                                    className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <LuTrash2 size={14} /> Delete Place
                                </button>
                            </div>
                        )}
                    </div>
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