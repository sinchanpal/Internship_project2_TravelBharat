import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
import { 
    LuArrowLeft, LuMapPin, LuCalendar, LuClock, LuMap, 
    LuExternalLink, LuTags, LuImage, LuNavigation, LuStar, LuMessageSquare 
} from 'react-icons/lu';

const PlaceDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);

    // New states for the Review/Comment system
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

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

    // Handler to submit the new rating and/or comment
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        
        if (rating === 0 && comment.trim() === '') {
            alert('Please provide either a rating or a comment before submitting.');
            return;
        }

        setSubmitting(true);
        try {
            const response = await axios.post(`${serverUrl}/api/explore/place/${place._id}/review`, 
            { rating, comment }, 
            { withCredentials: true }
            );

            if (response.data.success) {
                // Update local state to show the new review immediately without refreshing
                setPlace(prev => ({
                    ...prev,
                    reviews: response.data.reviews,
                    averageRating: response.data.averageRating,
                    numOfReviews: response.data.numOfReviews
                }));
                
                // Clear the form
                setRating(0);
                setComment('');
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert(error.response?.data?.message || 'Failed to post review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-[70vh] flex justify-center items-center">
                <ClipLoader color="#16a34a" size={50} />
            </div>
        );
    }

    if (!place) return null;

    // Sort reviews so the newest ones appear at the top
    const sortedReviews = place.reviews ? [...place.reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];

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
                        className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full w-fit text-sm font-medium shadow-sm cursor-pointer"
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

                    {/* Left Column: The Story, Attractions, Gallery & REVIEWS (65%) */}
                    <div className="w-full lg:w-2/3 space-y-10">
                        
                        {/* About Section */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Destination</h2>
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                                {place.description}
                            </p>
                        </div>

                        {/* Nearby Attractions Section */}
                        {place.nearbyAttractions && place.nearbyAttractions.length > 0 && (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <LuNavigation className="text-green-500" /> Nearby Attractions
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {place.nearbyAttractions.map((attraction, index) => (
                                        <span 
                                            key={index} 
                                            className="bg-green-50 hover:bg-green-100 transition-colors text-green-700 px-4 py-2 rounded-xl font-semibold text-sm border border-green-100 flex items-center gap-2 cursor-default"
                                        >
                                            <LuMapPin size={14} className="text-green-500" /> {attraction}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Image Gallery Section */}
                        {place.images && place.images.length > 0 && (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <LuImage className="text-green-500" /> Visual Journey
                                    </h2>
                                    <span className="text-sm font-medium text-gray-500">{place.images.length} Photos</span>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {place.images.map((img, index) => (
                                        <div 
                                            key={index} 
                                            className={`relative rounded-2xl overflow-hidden group shadow-sm bg-gray-100
                                                ${place.images.length === 1 ? 'col-span-2 md:col-span-3 h-80' : 'h-48 sm:h-56'} 
                                                ${place.images.length === 2 ? 'col-span-1 md:col-span-1' : ''}
                                            `}
                                        >
                                            <img 
                                                src={img} 
                                                alt={`${place.name} Gallery ${index + 1}`} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/*  Community Reviews & Comments Section */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <LuMessageSquare className="text-green-500" /> Community Reviews
                            </h2>
                            <p className="text-gray-500 mb-8">Share your experience or tips about visiting {place.name}.</p>

                            {/* Add Review Form */}
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-10">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Leave a Review</h3>
                                
                                {/* Star Rating Input */}
                                <div className="flex items-center gap-2 mb-4">
                                    {[...Array(5)].map((_, index) => {
                                        const starValue = index + 1;
                                        return (
                                            <button
                                                key={starValue}
                                                type="button"
                                                onClick={() => setRating(starValue)}
                                                onMouseEnter={() => setHoverRating(starValue)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="focus:outline-none cursor-pointer transition-transform hover:scale-110"
                                            >
                                                <LuStar 
                                                    size={28} 
                                                    className={`${
                                                        starValue <= (hoverRating || rating) 
                                                        ? "text-yellow-400 fill-yellow-400" 
                                                        : "text-gray-300"
                                                    } transition-colors`}
                                                />
                                            </button>
                                        );
                                    })}
                                    <span className="text-sm text-gray-500 ml-2">
                                        {rating > 0 ? `${rating} out of 5 stars` : ''}
                                    </span>
                                </div>

                                {/* Comment Textarea */}
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Write your comment or travel tips here..."
                                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-gray-700 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all resize-none h-32 mb-4 shadow-sm"
                                ></textarea>
                                
                                <button
                                    onClick={handleReviewSubmit}
                                    disabled={submitting}
                                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                                >
                                    {submitting ? 'Posting...' : 'Post Review'}
                                </button>
                            </div>

                            {/* Display Previous Comments */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
                                    Recent Comments ({sortedReviews.length})
                                </h3>
                                
                                {sortedReviews.length === 0 ? (
                                    <p className="text-gray-500 italic py-4">No reviews yet. Be the first to share your experience!</p>
                                ) : (
                                    sortedReviews.map((review) => (
                                        <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                {/* Profile Pic Placeholder or Image */}
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold uppercase shrink-0">
                                                    {review.profilePic ? (
                                                        <img src={review.profilePic} alt={review.name} className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        review.name.charAt(0)
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                                        {review.rating && (
                                                            <div className="flex items-center text-yellow-400">
                                                                <LuStar size={12} className="fill-yellow-400" />
                                                                <span className="ml-1 font-bold">{review.rating}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {review.comment && (
                                                <p className="text-gray-700 ml-13 leading-relaxed">
                                                    {review.comment}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Essential Info Sidebar (35%) */}
                    <div className="w-full lg:w-1/3">
                        <div className="sticky top-24 bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-8">
                            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Essential Information</h3>

                            {/* Show Average Rating if it exists */}
                            {place.averageRating > 0 && (
                                <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
                                    <div className="flex items-center gap-2">
                                        <LuStar size={24} className="text-yellow-500 fill-yellow-500" />
                                        <span className="font-extrabold text-xl text-yellow-700">{place.averageRating}</span>
                                        <span className="text-yellow-600 font-medium text-sm">/ 5</span>
                                    </div>
                                    <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full uppercase tracking-wider">
                                        {place.numOfReviews} {place.numOfReviews === 1 ? 'Rating' : 'Ratings'}
                                    </span>
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 mt-1 shrink-0">
                                        <LuCalendar size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Best Time to Visit</h4>
                                        <p className="text-gray-900 font-medium text-lg">{place.bestTimeToVisit}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-amber-50 p-3 rounded-2xl text-amber-600 mt-1 shrink-0">
                                        <LuClock size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Timings & Fees</h4>
                                        <p className="text-gray-900 font-medium text-lg">{place.entryFeesAndTimings}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-green-50 p-3 rounded-2xl text-green-600 mt-1 shrink-0">
                                        <LuMap size={24} />
                                    </div>
                                    <div className="w-full">
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Location</h4>
                                        <a
                                            href={place.locationMapLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 w-full justify-center bg-gray-900 hover:bg-black text-white px-4 py-3 rounded-xl transition-colors font-semibold mt-2 shadow-sm cursor-pointer"
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