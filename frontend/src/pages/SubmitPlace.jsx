import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
import { 
    LuMapPin, LuMap, LuBuilding2, LuAlignLeft, 
    LuX, LuTags, LuCalendar, LuClock, LuLink, LuSend 
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
    const [coverImage, setCoverImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [availableStates, setAvailableStates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Fetch all states for the dropdown
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setCoverImage(null);
        setImagePreview(null);
    };

    const handleSubmitPlace = async (e) => {
        e.preventDefault();
        
        if (!name || !selectedState || !city || !category || !description || !coverImage || !bestTimeToVisit || !entryFeesAndTimings || !locationMapLink) {
            setMessage({ type: 'error', text: 'Please fill in all required fields and select an image.' });
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
        formData.append('coverImage', coverImage); 

        try {
            
            const response = await axios.post(`${serverUrl}/api/user/submit-place`, formData, { 
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Display success message from backend regarding the 'pending' status
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
            removeImage();

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

                <form onSubmit={handleSubmitPlace} className="p-8 sm:p-10 space-y-6">
                    {message.text && (
                        <div className={`p-4 rounded-xl text-sm font-medium border ${message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-200'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Location & Name Data */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <LuMap size={18} />
                                </div>
                                <select
                                    value={selectedState}
                                    onChange={(e) => setSelectedState(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 appearance-none"
                                    required
                                >
                                    <option value="" disabled>Select State...</option>
                                    {availableStates.map((state) => (
                                        <option key={state._id} value={state._id}>{state.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">City / Town</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <LuBuilding2 size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="e.g. Munnar"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Destination Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <LuMapPin size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500"
                                    placeholder="e.g. Eravikulam National Park"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <LuTags size={18} />
                                </div>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 appearance-none"
                                    required
                                >
                                    <option value="" disabled>Select Category...</option>
                                    <option value="Heritage">Heritage</option>
                                    <option value="Nature">Nature</option>
                                    <option value="Adventure">Adventure</option>
                                    <option value="Religious">Religious</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100 my-6" />

                    {/* Essential Details Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Best Time to Visit</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <LuCalendar size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={bestTimeToVisit}
                                    onChange={(e) => setBestTimeToVisit(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500"
                                    placeholder="e.g. September to March"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Entry Fees & Timings</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <LuClock size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={entryFeesAndTimings}
                                    onChange={(e) => setEntryFeesAndTimings(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Google Maps Link</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <LuLink size={18} />
                            </div>
                            <input
                                type="url"
                                value={locationMapLink}
                                onChange={(e) => setLocationMapLink(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500"
                                placeholder="https://goo.gl/maps/..."
                                required
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100 my-6" />

                    {/* Image & Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Stunning Cover Image</label>
                        {!imagePreview ? (
                            <div className="mt-1 flex justify-center px-6 pt-6 pb-8 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 bg-gray-50 cursor-pointer transition-colors">
                                <div className="space-y-2 text-center">
                                    <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 px-2 py-1 shadow-sm border border-gray-200">
                                            <span>Upload a high-quality photo</span>
                                            <input id="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative mt-2 rounded-xl overflow-hidden shadow-sm border border-gray-200 group">
                                <img src={imagePreview} alt="Preview" className="w-full h-56 object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button type="button" onClick={removeImage} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors flex items-center gap-2 font-medium px-4">
                                        <LuX size={20} /> Remove Image
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Description</label>
                        <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                                <LuAlignLeft size={18} />
                            </div>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={6}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 resize-y leading-relaxed"
                                placeholder="Tell fellow travelers about the history, beauty, and uniqueness of this destination..."
                                required
                            />
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