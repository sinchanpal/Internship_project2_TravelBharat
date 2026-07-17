import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
import { 
    LuMapPin, LuMap, LuBuilding2, LuAlignLeft, 
    LuX, LuTags, LuCalendar, LuClock, LuLink, LuSend, LuPlus 
} from "react-icons/lu";
import { FaCloudUploadAlt } from "react-icons/fa";

const SubmitPlace = () => {
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

    // NEW: Optional Fields State
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    
    const [attractionInput, setAttractionInput] = useState('');
    const [nearbyAttractions, setNearbyAttractions] = useState([]);

    const [availableStates, setAvailableStates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Fetch all states for the dropdown
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/explore/states`, { withCredentials: true });
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

    // Handlers for Nearby Attractions
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

    const handleSubmitPlace = async (e) => {
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
            const response = await axios.post(`${serverUrl}/api/user/submit-place`, formData, { 
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
                text: error.response?.data?.message || 'An error occurred while submitting.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mx-auto">
                
                <div className="bg-linear-to-r from-green-600 to-green-500 py-8 px-8 sm:px-10 text-center">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Help Grow TravelBharat</h2>
                    <p className="text-green-50 font-medium">Submit a beautiful destination to our digital encyclopedia. All submissions are reviewed by our moderation team before going live.</p>
                </div>

                <form onSubmit={handleSubmitPlace} className="p-8 sm:p-10 space-y-8">
                    {message.text && (
                        <div className={`p-4 rounded-xl text-sm font-medium border ${message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-200'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Section 1: Location & Details */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Core Details</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><LuMap size={18} /></div>
                                    <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 appearance-none" required>
                                        <option value="" disabled>Select State...</option>
                                        {availableStates.map((state) => <option key={state._id} value={state._id}>{state.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">City / Town *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><LuBuilding2 size={18} /></div>
                                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Munnar" className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500" required />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Destination Name *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><LuMapPin size={18} /></div>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500" placeholder="e.g. Eravikulam National Park" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><LuTags size={18} /></div>
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 appearance-none" required>
                                        <option value="" disabled>Select Category...</option>
                                        <option value="Heritage">Heritage</option>
                                        <option value="Nature">Nature</option>
                                        <option value="Adventure">Adventure</option>
                                        <option value="Religious">Religious</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Essential Info */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Essential Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Best Time to Visit *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><LuCalendar size={18} /></div>
                                    <input type="text" value={bestTimeToVisit} onChange={(e) => setBestTimeToVisit(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500" placeholder="e.g. September to March" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Entry Fees & Timings *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><LuClock size={18} /></div>
                                    <input type="text" value={entryFeesAndTimings} onChange={(e) => setEntryFeesAndTimings(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500" required />
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Google Maps Link *</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><LuLink size={18} /></div>
                                <input type="url" value={locationMapLink} onChange={(e) => setLocationMapLink(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500" placeholder="https://goo.gl/maps/..." required />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Description *</label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 pointer-events-none text-gray-400"><LuAlignLeft size={18} /></div>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 resize-y leading-relaxed" placeholder="Tell fellow travelers about the history, beauty, and uniqueness of this destination..." required />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Media & Enrichment (NEW) */}
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex justify-between items-end">
                            Media & Enrichment
                            <span className="text-xs text-gray-500 font-normal">Enhance the destination page</span>
                        </h3>
                        
                        {/* Cover Image (Required) */}
                        <div className="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Stunning Cover Image *</label>
                            {!imagePreview ? (
                                <div className="flex justify-center px-6 py-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 bg-gray-50 cursor-pointer transition-colors">
                                    <label className="relative cursor-pointer text-center flex flex-col items-center w-full">
                                        <FaCloudUploadAlt className="h-10 w-10 text-gray-400 mb-2" />
                                        <span className="text-sm font-medium text-green-600 bg-white px-3 py-1 rounded-md shadow-sm border border-gray-200">Upload a high-quality photo</span>
                                        <p className="text-xs text-gray-500 mt-2">PNG, JPG, WEBP up to 5MB</p>
                                        <input type="file" accept="image/*" className="sr-only" onChange={handleCoverImageChange} required />
                                    </label>
                                </div>
                            ) : (
                                <div className="relative mt-2 rounded-xl overflow-hidden shadow-sm border border-gray-200 group w-full h-48">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <button type="button" onClick={removeCoverImage} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors flex items-center gap-2 font-medium px-4">
                                            <LuX size={20} /> Remove
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Gallery Images (Optional) */}
                        <div className="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-sm font-bold text-gray-700">Image Gallery <span className="text-gray-400 font-normal">(Optional)</span></label>
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{galleryFiles.length} / 5</span>
                            </div>
                            
                            {galleryFiles.length < 5 && (
                                <div className="flex justify-center px-6 py-4 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 bg-gray-50 cursor-pointer mb-3 transition-colors">
                                    <label className="relative cursor-pointer text-center w-full">
                                        <span className="text-sm font-medium text-green-600 flex items-center justify-center gap-2">
                                            <LuPlus size={18}/> Select additional photos
                                        </span>
                                        <input type="file" accept="image/*" multiple className="sr-only" onChange={handleGalleryChange} />
                                    </label>
                                </div>
                            )}
                            
                            {galleryPreviews.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                    {galleryPreviews.map((preview, index) => (
                                        <div key={index} className="relative rounded-xl overflow-hidden border border-gray-200 h-24 group shadow-sm">
                                            <img src={preview} alt="Gallery Preview" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeGalleryImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md">
                                                <LuX size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Nearby Attractions (Optional) */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nearby Attractions <span className="text-gray-400 font-normal">(Optional)</span></label>
                            <p className="text-xs text-gray-500 mb-3">Add famous spots near this destination (e.g. 'Viewpoint', 'Local Market')</p>
                            
                            <div className="flex gap-2 mb-3">
                                <input 
                                    type="text" 
                                    value={attractionInput}
                                    onChange={(e) => setAttractionInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddAttraction(e)}
                                    placeholder="Type an attraction..."
                                    className="block w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 transition-colors" 
                                />
                                <button type="button" onClick={handleAddAttraction} className="bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-black whitespace-nowrap transition-colors flex items-center gap-1 shadow-sm">
                                    <LuPlus size={16} /> Add
                                </button>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                {nearbyAttractions.map((attraction, index) => (
                                    <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-green-50 text-green-700 border border-green-200 shadow-sm">
                                        {attraction}
                                        <button type="button" onClick={() => removeAttraction(attraction)} className="text-green-500 hover:text-green-800 p-0.5 rounded-full hover:bg-green-100 transition-colors">
                                            <LuX size={14} />
                                        </button>
                                    </span>
                                ))}
                                {nearbyAttractions.length === 0 && <span className="text-sm text-gray-400 italic py-2">No nearby attractions added yet.</span>}
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-md text-lg font-bold text-white bg-green-600 hover:bg-green-700 transition-all transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:transform-none mt-8">
                        {loading ? <ClipLoader color="#ffffff" size={24} /> : <><LuSend size={20} /> Submit for Review</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SubmitPlace;