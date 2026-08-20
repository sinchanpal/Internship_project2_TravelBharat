import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import toast from 'react-hot-toast'; 
import { LuArrowRight } from "react-icons/lu";
import { LuPencil } from "react-icons/lu";
import { LuTrash2 } from "react-icons/lu";
import { LuSettings } from "react-icons/lu";

const StateCard = ({ state, onDeleteSuccess }) => {
    const navigate = useNavigate();
    const { userData } = useSelector((state) => state.user);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const fallbackImage = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop";

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

    const handleEditClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuOpen(false);
        navigate(`/admin/edit-state/${state._id}`);
    };

    const handleDeleteClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuOpen(false);

        if (window.confirm(`Are you sure you want to delete ${state.name}?`)) {
            try {
                const response = await axios.delete(`${serverUrl}/api/admin/state/${state._id}`, {
                    withCredentials: true
                });

                if (response.data.success) {
                    toast.success(response.data.message);
                    if (onDeleteSuccess) onDeleteSuccess(state._id);
                }
            } catch (error) {
                console.error("Delete error:", error);
                toast.error(error.response?.data?.message || "Failed to delete state");
            }
        }
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

            {/* CONDITIONAL ADMIN SETTINGS MENU */}
            {userData?.role === 'admin' && (
                <div className="absolute top-4 right-4 z-30" ref={menuRef}>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setMenuOpen(!menuOpen);
                        }}
                        className="bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
                        title="Admin Settings"
                    >
                        <LuSettings size={18} />
                    </button>

                    {/* Dropdown Menu */}
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 py-1 z-40">
                            <button
                                onClick={handleEditClick}
                                className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                                <LuPencil size={14} className="text-amber-500" /> Edit State
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <LuTrash2 size={14} /> Delete State
                            </button>
                        </div>
                    )}
                </div>
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