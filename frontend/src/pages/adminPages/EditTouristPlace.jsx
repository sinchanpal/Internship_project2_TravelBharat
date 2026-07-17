import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import {
    LuMapPin, LuMap, LuBuilding2, LuAlignLeft,
    LuX, LuTags, LuCalendar, LuClock, LuLink, LuPlus
} from "react-icons/lu";

const EditTouristPlace = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [placeId, setPlaceId] = useState('');
    const [name, setName] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [city, setCity] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    const [bestTimeToVisit, setBestTimeToVisit] = useState('');
    const [entryFeesAndTimings, setEntryFeesAndTimings] = useState('');
    const [locationMapLink, setLocationMapLink] = useState('');

    // Core Image State
    const [coverImage, setCoverImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // NEW: Optional Fields State
    const [existingGallery, setExistingGallery] = useState([]); // To show what is currently in DB
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    
    const [attractionInput, setAttractionInput] = useState('');
    const [nearbyAttractions, setNearbyAttractions] = useState([]);

    const [availableStates, setAvailableStates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // 1. Fetch States and the Specific Place Data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch states for the dropdown
                const stateRes = await axios.get(`${serverUrl}/api/explore/get-all-states`, { withCredentials: true });
                setAvailableStates(stateRes.data.states);

                // Fetch the existing tourist place data
                const placeRes = await axios.get(`${serverUrl}/api/explore/place/${slug}`, { withCredentials: true });
                const existingPlace = placeRes.data.place;

                if (existingPlace) {
                    setPlaceId(existingPlace._id);
                    setName(existingPlace.name);
                    setSelectedState(existingPlace.state._id);
                    setCity(existingPlace.city);
                    setCategory(existingPlace.category[0]);
                    setDescription(existingPlace.description);
                    setBestTimeToVisit(existingPlace.bestTimeToVisit);
                    setEntryFeesAndTimings(existingPlace.entryFeesAndTimings);
                    setLocationMapLink(existingPlace.locationMapLink);
                    setImagePreview(existingPlace.coverImage);
                    
                    // Populate optional fields
                    setExistingGallery(existingPlace.images || []);
                    setNearbyAttractions(existingPlace.nearbyAttractions || []);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setMessage({ type: 'error', text: 'Failed to load tourist place details.' });
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [slug]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Handlers for Gallery Images
    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + galleryFiles.length > 5) {
            alert("You can only upload a maximum of 5 gallery images.");
            return;
        }

        const newFiles = [...galleryFiles, ...files];
        setGalleryFiles(newFiles);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setGalleryPreviews([...galleryPreviews, ...newPreviews]);
    };

    const removeGalleryImage = (indexToRemove) => {
        setGalleryFiles(galleryFiles.filter((_, index) => index !== indexToRemove));
        setGalleryPreviews(galleryPreviews.filter((_, index) => index !== indexToRemove));
    };

    //  Handlers for Nearby Attractions
    const handleAddAttraction = (e) => {
        e.preventDefault(); 
        if (attractionInput.trim() && !nearbyAttractions.includes(attractionInput.trim())) {
            setNearbyAttractions([...nearbyAttractions, attractionInput.trim()]);
            setAttractionInput('');
        }
    };

    const removeAttraction = (attractionToRemove) => {
        setNearbyAttractions(nearbyAttractions.filter(attr => attr !== attractionToRemove));
    };

    const handleUpdatePlace = async (e) => {
        e.preventDefault();

        if (!name || !selectedState || !city || !category || !description || !bestTimeToVisit || !entryFeesAndTimings || !locationMapLink) {
            setMessage({ type: 'error', text: 'Please fill in all required text fields.' });
            return;
        }

        setSaving(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData();
        formData.append('name', name);
        formData.append('state', selectedState);
        formData.append('city', city);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('bestTimeToVisit', bestTimeToVisit);
        formData.append('entryFeesAndTimings', entryFeesAndTimings);
        formData.append('locationMapLink', locationMapLink);

        // Only append the cover image if the admin uploaded a new one
        if (coverImage) {
            formData.append('coverImage', coverImage);
        }

        // NEW: Append Gallery Images (if any new ones are selected, backend will replace the old ones)
        if (galleryFiles.length > 0) {
            galleryFiles.forEach(file => {
                formData.append('images', file);
            });
        }

        // NEW: Append Nearby Attractions as a JSON string (send empty array if all removed)
        formData.append('nearbyAttractions', JSON.stringify(nearbyAttractions));

        try {
            const response = await axios.put(`${serverUrl}/api/admin/place/${placeId}`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMessage({ type: 'success', text: response.data.message || 'Updated successfully!' });

            // Redirect to the place details page to see changes
            setTimeout(() => {
                navigate(`/place/${response.data.place.slug}`);
            }, 1500);

        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'An error occurred.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full flex justify-center items-center py-20">
                <ClipLoader color="#f59e0b" size={40} />
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mx-auto mt-8 mb-12">
                <div className="bg-amber-500 py-6 px-8 flex items-center gap-3">
                    <LuMapPin className="text-white" size={28} />
                    <h2 className="text-2xl font-bold text-white tracking-wide">Edit Tourist Place</h2>
                </div>

                <form onSubmit={handleUpdatePlace} className="p-8 space-y-8">
                    {message.text && (
                        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Section 1: Core Details */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Core Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                                <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500" required>
                                    <option value="" disabled>Select State...</option>
                                    {availableStates.map((state) => (
                                        <option key={state._id} value={state._id}>{state.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">City / Town *</label>
                                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Destination Name *</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500" required>
                                    <option value="Heritage">Heritage</option>
                                    <option value="Nature">Nature</option>
                                    <option value="Adventure">Adventure</option>
                                    <option value="Religious">Religious</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Essential Info */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Essential Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Best Time to Visit *</label>
                                <input type="text" value={bestTimeToVisit} onChange={(e) => setBestTimeToVisit(e.target.value)} className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Entry Fees & Timings *</label>
                                <input type="text" value={entryFeesAndTimings} onChange={(e) => setEntryFeesAndTimings(e.target.value)} className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500" required />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Google Maps Link *</label>
                            <input type="url" value={locationMapLink} onChange={(e) => setLocationMapLink(e.target.value)} className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500" required />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500 resize-y" required />
                        </div>
                    </div>

                    {/* Section 3: Media & Enrichment */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex justify-between items-end">
                            Media & Enrichment
                        </h3>
                        
                        {/* Cover Image */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image (Optional to update)</label>
                            <div className="relative mt-2 rounded-xl overflow-hidden shadow-sm border border-gray-200 group">
                                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <label className="bg-white text-gray-900 p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer font-medium px-4">
                                        Upload New Cover Image
                                        <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Gallery Images */}
                        <div className="mb-6">
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-sm font-semibold text-gray-700">Image Gallery (Optional)</label>
                                <span className="text-xs text-gray-500">{galleryFiles.length > 0 ? galleryFiles.length : existingGallery.length} / 5</span>
                            </div>
                            
                            {/* Warning message explaining backend behavior */}
                            <p className="text-xs text-amber-600 mb-3 bg-amber-50 p-2 rounded-lg border border-amber-100">
                                <strong>Note:</strong> Uploading new images here will completely replace the existing gallery. Leave blank to keep current images.
                            </p>

                            {galleryFiles.length < 5 && (
                                <div className="flex justify-center px-6 py-4 border-2 border-gray-300 border-dashed rounded-xl hover:border-amber-500 bg-gray-50 cursor-pointer mb-3">
                                    <label className="relative cursor-pointer text-center w-full">
                                        <span className="text-sm font-medium text-amber-600 flex items-center justify-center gap-2">
                                            <LuPlus size={16}/> Upload New Gallery Images
                                        </span>
                                        <input type="file" accept="image/*" multiple className="sr-only" onChange={handleGalleryChange} />
                                    </label>
                                </div>
                            )}
                            
                            {/* Show New Previews if uploading, otherwise show existing DB images */}
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                {galleryPreviews.length > 0 ? (
                                    // Showing newly selected files
                                    galleryPreviews.map((preview, index) => (
                                        <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200 h-20 group">
                                            <img src={preview} alt="New Gallery Preview" className="w-full h-full object-cover" />
                                            <button 
                                                type="button" 
                                                onClick={() => removeGalleryImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <LuX size={12} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    // Showing existing images from DB
                                    existingGallery.map((imgUrl, index) => (
                                        <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200 h-20">
                                            <img src={imgUrl} alt="Existing Gallery" className="w-full h-full object-cover opacity-80" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Nearby Attractions */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nearby Attractions (Optional)</label>
                            <div className="flex gap-2 mb-3">
                                <input 
                                    type="text" 
                                    value={attractionInput}
                                    onChange={(e) => setAttractionInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddAttraction(e)}
                                    placeholder="e.g. Tiger Hill"
                                    className="block w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500" 
                                />
                                <button type="button" onClick={handleAddAttraction} className="bg-gray-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-black whitespace-nowrap">
                                    Add
                                </button>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                {nearbyAttractions.map((attraction, index) => (
                                    <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                        {attraction}
                                        <button type="button" onClick={() => removeAttraction(attraction)} className="text-amber-500 hover:text-amber-800">
                                            <LuX size={14} />
                                        </button>
                                    </span>
                                ))}
                                {nearbyAttractions.length === 0 && <span className="text-sm text-gray-400 italic">No nearby attractions added yet.</span>}
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={saving} className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-amber-500 hover:bg-amber-600 transition-colors disabled:bg-gray-400 mt-6">
                        {saving ? <ClipLoader color="#ffffff" size={24} /> : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditTouristPlace;