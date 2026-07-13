import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import { LuMapPin, LuUser, LuCalendar, LuImage } from "react-icons/lu";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { GoXCircle } from "react-icons/go";

const PendingApprovals = () => {
    const [pendingPlaces, setPendingPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null); // Tracks which place is currently being approved/rejected

    useEffect(() => {
        fetchPendingPlaces();
    }, []);

    const fetchPendingPlaces = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/admin/pending-places`, { withCredentials: true });
            setPendingPlaces(response.data.places);
        } catch (error) {
            console.error("Error fetching pending places:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm("Are you sure you want to approve this destination and make it live?")) return;

        setProcessingId(id);
        try {
            await axios.put(`${serverUrl}/api/admin/approve-place/${id}`, {}, { withCredentials: true });
            // Remove the approved place from the local state
            setPendingPlaces(pendingPlaces.filter(place => place._id !== id));
        } catch (error) {
            alert(error.response?.data?.message || "Failed to approve place");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Are you sure you want to reject and completely delete this submission?")) return;

        setProcessingId(id);
        try {
            await axios.delete(`${serverUrl}/api/admin/reject-place/${id}`, { withCredentials: true });
            // Remove the rejected place from the local state
            setPendingPlaces(pendingPlaces.filter(place => place._id !== id));
        } catch (error) {
            alert(error.response?.data?.message || "Failed to reject place");
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="w-full flex justify-center items-center py-20">
                <ClipLoader color="#16a34a" size={40} />
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8 mb-12">
                <div className="bg-gray-900 py-6 px-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-wide">Pending Approvals</h2>
                        <p className="text-gray-400 text-sm mt-1">Review destinations submitted by contributors</p>
                    </div>
                    <span className="bg-amber-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                        {pendingPlaces.length} Pending
                    </span>
                </div>

                <div className="p-0 sm:p-6">
                    {pendingPlaces.length === 0 ? (
                        <div className="text-center py-16">
                            <h3 className="text-xl font-bold text-gray-700 mb-2">You're all caught up!</h3>
                            <p className="text-gray-500">There are no pending submissions to review right now.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {pendingPlaces.map((place) => (
                                <div key={place._id} className="flex flex-col xl:flex-row gap-6 p-6 border border-gray-200 rounded-2xl hover:border-amber-300 transition-colors bg-gray-50">

                                    {/* Image Preview */}
                                    <div className="w-full xl:w-64 h-48 shrink-0 rounded-xl overflow-hidden bg-gray-200 relative">
                                        <img src={place.coverImage} alt={place.name} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                                            <LuImage size={12} /> Cover
                                        </div>
                                    </div>

                                    {/* Data Details */}
                                    <div className="grow flex flex-col justify-between">
                                        <div>
                                            <div className="flex flex-wrap gap-2 items-center mb-2">
                                                <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">{place.category[0]}</span>
                                                <span className="text-gray-500 text-sm flex items-center gap-1"><LuMapPin size={14} /> {place.city}, {place.state?.name}</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{place.name}</h3>
                                            <p className="text-gray-600 text-sm line-clamp-3 mb-4">{place.description}</p>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-100">
                                                <div className="flex items-center gap-2"><LuCalendar className="text-amber-500" /> <span className="font-semibold">Best Time:</span> {place.bestTimeToVisit}</div>
                                                <div className="flex items-center gap-2"><LuUser className="text-blue-500" /> <span className="font-semibold">Submitted by:</span> {place.createdBy?.name || 'Unknown'} ({place.createdBy?.email || 'N/A'})</div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-4 mt-6 xl:mt-0 xl:justify-end items-end h-full">
                                            <button
                                                onClick={() => handleReject(place._id)}
                                                disabled={processingId === place._id}
                                                className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold rounded-xl transition-colors disabled:opacity-50"
                                            >
                                                {processingId === place._id ? <ClipLoader size={16} color="#dc2626" /> : <><GoXCircle size={18} /> Reject</>}
                                            </button>
                                            <button
                                                onClick={() => handleApprove(place._id)}
                                                disabled={processingId === place._id}
                                                className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50"
                                            >
                                                {processingId === place._id ? <ClipLoader size={16} color="#ffffff" /> : <><IoMdCheckmarkCircleOutline size={18} /> Approve</>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PendingApprovals;