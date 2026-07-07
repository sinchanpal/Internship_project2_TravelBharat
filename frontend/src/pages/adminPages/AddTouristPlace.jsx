import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import {
    LuMapPin, LuMap, LuBuilding2, LuAlignLeft,
    LuX, LuTags, LuCalendar, LuClock, LuLink
} from "react-icons/lu";
import { FaCloudUploadAlt } from "react-icons/fa";

const AddTouristPlace = () => {

    const [name, setName] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [city, setCity] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);


    const [bestTimeToVisit, setBestTimeToVisit] = useState('');
    const [entryFeesAndTimings, setEntryFeesAndTimings] = useState('Free Entry | Open 24 Hours');
    const [locationMapLink, setLocationMapLink] = useState('');

    const [availableStates, setAvailableStates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Fetch all states on component mount
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

    const handleAddPlace = async (e) => {
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
            const response = await axios.post(`${serverUrl}/api/admin/place`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMessage({ type: 'success', text: response.data.message || 'Tourist place added successfully!' });

            // Clear form including new fields
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
                text: error.response?.data?.message || 'An error occurred.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mx-auto mt-8 mb-12">

                <div className="bg-gray-900 py-6 px-8 flex items-center gap-3">
                    <LuMapPin className="text-green-400" size={28} />
                    <h2 className="text-2xl font-bold text-white tracking-wide">Add Tourist Place</h2>
                </div>

                <form onSubmit={handleAddPlace} className="p-8 space-y-6">

                    {message.text && (
                        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Location & Name Data */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    placeholder="e.g. Kolkata"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    placeholder="e.g. Victoria Memorial"
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

                    <hr className="border-gray-100 my-4" />

                    {/* ESSENTIAL DETAILS SECTION */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    placeholder="e.g. October to March"
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
                                    placeholder="e.g. ₹50 Entry | 9:00 AM - 5:00 PM"
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

                    <hr className="border-gray-100 my-4" />

                    {/* Image & Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
                        {!imagePreview ? (
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 bg-gray-50 cursor-pointer">
                                <div className="space-y-1 text-center">
                                    <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 px-1">
                                            <span>Upload a file</span>
                                            <input id="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative mt-2 rounded-xl overflow-hidden shadow-sm border border-gray-200 group">
                                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button type="button" onClick={removeImage} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors flex items-center gap-2 font-medium px-4">
                                        <LuX size={20} /> Remove Image
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                                <LuAlignLeft size={18} />
                            </div>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={5}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 resize-y"
                                placeholder="A detailed description and historical significance..."
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-gray-900 hover:bg-black transition-colors disabled:bg-gray-400 mt-6">
                        {loading ? <ClipLoader color="#ffffff" size={24} /> : "Upload & Save Destination"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTouristPlace;