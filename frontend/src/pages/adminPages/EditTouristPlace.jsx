import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import {
    LuMapPin, LuMap, LuBuilding2, LuAlignLeft,
    LuX, LuTags, LuCalendar, LuClock, LuLink
} from "react-icons/lu";
import { FaCloudUploadAlt } from "react-icons/fa";

const EditTouristPlace = () => {
    const { slug } = useParams(); // We use slug to fetch the data
    const navigate = useNavigate();

    const [placeId, setPlaceId] = useState(''); // We need the ID for the PUT request
    const [name, setName] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [city, setCity] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    const [bestTimeToVisit, setBestTimeToVisit] = useState('');
    const [entryFeesAndTimings, setEntryFeesAndTimings] = useState('');
    const [locationMapLink, setLocationMapLink] = useState('');

    const [coverImage, setCoverImage] = useState(null); // New file to upload (optional)
    const [imagePreview, setImagePreview] = useState(null);

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
                    setSelectedState(existingPlace.state._id); // Because state is populated
                    setCity(existingPlace.city);
                    setCategory(existingPlace.category[0]);
                    setDescription(existingPlace.description);
                    setBestTimeToVisit(existingPlace.bestTimeToVisit);
                    setEntryFeesAndTimings(existingPlace.entryFeesAndTimings);
                    setLocationMapLink(existingPlace.locationMapLink);
                    setImagePreview(existingPlace.coverImage);
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

        // Only append the image if the admin uploaded a new one
        if (coverImage) {
            formData.append('coverImage', coverImage);
        }

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
                <ClipLoader color="#16a34a" size={40} />
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mx-auto mt-8 mb-12">
                <div className="bg-amber-500 py-6 px-8 flex items-center gap-3">
                    <LuMapPin className="text-white" size={28} />
                    <h2 className="text-2xl font-bold text-white tracking-wide">Edit Tourist Place</h2>
                </div>

                <form onSubmit={handleUpdatePlace} className="p-8 space-y-6">
                    {message.text && (
                        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Location & Name Data */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                            <select
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
                                required
                            >
                                <option value="" disabled>Select State...</option>
                                {availableStates.map((state) => (
                                    <option key={state._id} value={state._id}>{state.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">City / Town</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Destination Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
                                required
                            >
                                <option value="Heritage">Heritage</option>
                                <option value="Nature">Nature</option>
                                <option value="Adventure">Adventure</option>
                                <option value="Religious">Religious</option>
                            </select>
                        </div>
                    </div>

                    <hr className="border-gray-100 my-4" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Best Time to Visit</label>
                            <input
                                type="text"
                                value={bestTimeToVisit}
                                onChange={(e) => setBestTimeToVisit(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Entry Fees & Timings</label>
                            <input
                                type="text"
                                value={entryFeesAndTimings}
                                onChange={(e) => setEntryFeesAndTimings(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Google Maps Link</label>
                        <input
                            type="url"
                            value={locationMapLink}
                            onChange={(e) => setLocationMapLink(e.target.value)}
                            className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
                            required
                        />
                    </div>

                    <hr className="border-gray-100 my-4" />

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image (Optional)</label>
                        <div className="relative mt-2 rounded-xl overflow-hidden shadow-sm border border-gray-200 group">
                            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <label className="bg-white text-gray-900 p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer font-medium px-4">
                                    Change Image
                                    <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={5}
                            className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500 resize-y"
                            required
                        />
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