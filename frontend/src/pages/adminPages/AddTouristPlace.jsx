import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import {
    LuMapPin, LuMap, LuBuilding2, LuAlignLeft,
    LuX, LuTags, LuCalendar, LuClock, LuLink, LuPlus
} from "react-icons/lu";
import { FaCloudUploadAlt } from "react-icons/fa";

const AddTouristPlace = () => {
    const [name, setName] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [city, setCity] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [bestTimeToVisit, setBestTimeToVisit] = useState('');
    const [entryFeesAndTimings, setEntryFeesAndTimings] = useState('Free Entry | Open 24 Hours');
    const [locationMapLink, setLocationMapLink] = useState('');

    // Core Image State
    const [coverImage, setCoverImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Optional Fields State
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    const [attractionInput, setAttractionInput] = useState('');
    const [nearbyAttractions, setNearbyAttractions] = useState([]);

    const [availableStates, setAvailableStates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/explore/get-all-states`, { withCredentials: true });
                setAvailableStates(response.data.states);
            } catch (error) {
                console.error("Error fetching states:", error);
            }
        };
        fetchStates();
    }, []);

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeCoverImage = () => {
        setCoverImage(null);
        setImagePreview(null);
    };

    //Handlers for Gallery Images
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

    //Handlers for Nearby Attractions
    const handleAddAttraction = (e) => {
        e.preventDefault(); // Prevent form submission if they press enter
        if (attractionInput.trim() && !nearbyAttractions.includes(attractionInput.trim())) {
            setNearbyAttractions([...nearbyAttractions, attractionInput.trim()]);
            setAttractionInput('');
        }
    };

    const removeAttraction = (attractionToRemove) => {
        setNearbyAttractions(nearbyAttractions.filter(attr => attr !== attractionToRemove));
    };

    const handleAddPlace = async (e) => {
        e.preventDefault();

        if (!name || !selectedState || !city || !category || !description || !coverImage || !bestTimeToVisit || !entryFeesAndTimings || !locationMapLink) {
            setMessage({ type: 'error', text: 'Please fill in all required fields and select a cover image.' });
            return;
        }

        setLoading(true);
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

        // Append Cover Image
        formData.append('coverImage', coverImage);

        // Append Gallery Images
        galleryFiles.forEach(file => {
            formData.append('images', file);
        });

        // Append Nearby Attractions as a JSON string
        if (nearbyAttractions.length > 0) {
            formData.append('nearbyAttractions', JSON.stringify(nearbyAttractions));
        }

        try {
            const response = await axios.post(`${serverUrl}/api/admin/place`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMessage({ type: 'success', text: response.data.message });

            // Clear form
            setName('');
            setSelectedState('');
            setCity('');
            setCategory('');
            setDescription('');
            setBestTimeToVisit('');
            setEntryFeesAndTimings('Free Entry | Open 24 Hours');
            setLocationMapLink('');
            removeCoverImage();
            setGalleryFiles([]);
            setGalleryPreviews([]);
            setNearbyAttractions([]);
            setAttractionInput('');

        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'An error occurred.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mx-auto mt-8 mb-12">
                <div className="bg-gray-900 py-6 px-8 flex items-center gap-3">
                    <LuMapPin className="text-green-400" size={28} />
                    <h2 className="text-2xl font-bold text-white tracking-wide">Add Tourist Place</h2>
                </div>

                <form onSubmit={handleAddPlace} className="p-8 space-y-8">
                    {message.text && (
                        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Section 1: Core Details (Existing) */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Core Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                                <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500" required>
                                    <option value="" disabled>Select State...</option>
                                    {availableStates.map((state) => <option key={state._id} value={state._id}>{state.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">City / Town *</label>
                                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Destination Name *</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500" required>
                                    <option value="" disabled>Select Category...</option>
                                    <option value="Heritage">Heritage</option>
                                    <option value="Nature">Nature</option>
                                    <option value="Adventure">Adventure</option>
                                    <option value="Religious">Religious</option>
                                    <option value="Beach">Beach</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Essential Info (Existing) */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Essential Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Best Time to Visit *</label>
                                <input type="text" value={bestTimeToVisit} onChange={(e) => setBestTimeToVisit(e.target.value)} className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Entry Fees & Timings *</label>
                                <input type="text" value={entryFeesAndTimings} onChange={(e) => setEntryFeesAndTimings(e.target.value)} className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500" required />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Google Maps Link *</label>
                            <input type="url" value={locationMapLink} onChange={(e) => setLocationMapLink(e.target.value)} className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 resize-y" required />
                        </div>
                    </div>

                    {/* Section 3: Media & Enrichment (NEW) */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex justify-between items-end">
                            Media & Enrichment
                            <span className="text-xs text-gray-500 font-normal">Optional fields to enhance the page</span>
                        </h3>

                        {/* Cover Image (Required) */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image *</label>
                            {!imagePreview ? (
                                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 bg-gray-50 cursor-pointer">
                                    <label className="relative cursor-pointer text-center flex flex-col items-center">
                                        <FaCloudUploadAlt className="h-10 w-10 text-gray-400 mb-2" />
                                        <span className="text-sm font-medium text-green-600">Upload cover photo</span>
                                        <input type="file" accept="image/*" className="sr-only" onChange={handleCoverImageChange} required />
                                    </label>
                                </div>
                            ) : (
                                <div className="relative mt-2 rounded-xl overflow-hidden shadow-sm border border-gray-200 group w-full h-40">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <button type="button" onClick={removeCoverImage} className="bg-red-500 text-white p-2 rounded-full font-medium px-4 flex items-center gap-2">
                                            <LuX size={16} /> Remove
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Gallery Images (Optional) */}
                        <div className="mb-6">
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-sm font-semibold text-gray-700">Image Gallery (Optional)</label>
                                <span className="text-xs text-gray-500">{galleryFiles.length} / 5 selected</span>
                            </div>

                            {galleryFiles.length < 5 && (
                                <div className="flex justify-center px-6 py-4 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 bg-gray-50 cursor-pointer mb-3">
                                    <label className="relative cursor-pointer text-center w-full">
                                        <span className="text-sm font-medium text-green-600 flex items-center justify-center gap-2">
                                            <LuPlus size={16} /> Add Gallery Images
                                        </span>
                                        <input type="file" accept="image/*" multiple className="sr-only" onChange={handleGalleryChange} />
                                    </label>
                                </div>
                            )}

                            {galleryPreviews.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                    {galleryPreviews.map((preview, index) => (
                                        <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200 h-20 group">
                                            <img src={preview} alt="Gallery Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <LuX size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Nearby Attractions (Optional) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nearby Attractions (Optional)</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={attractionInput}
                                    onChange={(e) => setAttractionInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddAttraction(e)}
                                    placeholder="e.g. Tiger Hill"
                                    className="block w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500"
                                />
                                <button type="button" onClick={handleAddAttraction} className="bg-gray-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-black whitespace-nowrap">
                                    Add
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {nearbyAttractions.map((attraction, index) => (
                                    <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                                        {attraction}
                                        <button type="button" onClick={() => removeAttraction(attraction)} className="text-green-500 hover:text-green-800">
                                            <LuX size={14} />
                                        </button>
                                    </span>
                                ))}
                                {nearbyAttractions.length === 0 && <span className="text-sm text-gray-400 italic">No nearby attractions added yet.</span>}
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-green-600 hover:bg-green-700 transition-colors disabled:bg-gray-400 mt-6">
                        {loading ? <ClipLoader color="#ffffff" size={24} /> : "Save Destination Details"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTouristPlace;