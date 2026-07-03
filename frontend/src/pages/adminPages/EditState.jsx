import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import { LuMap, LuImage, LuAlignLeft, LuX } from "react-icons/lu";
import { FaCloudUploadAlt } from "react-icons/fa";

const EditState = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState(null); // The new file to upload (optional)
    const [imagePreview, setImagePreview] = useState(null); // The preview of the image

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Fetch the existing state data when the component loads
    useEffect(() => {
        const fetchStateData = async () => {
            try {
                // Fetching from your public states route to find the specific one
                const response = await axios.get(`${serverUrl}/api/explore/get-all-states`, { withCredentials: true });
                const existingState = response.data.states.find(s => s._id === id);

                if (existingState) {
                    setName(existingState.name);
                    setDescription(existingState.description);
                    setImagePreview(existingState.coverImage); // Set the current image as preview
                } else {
                    setMessage({ type: 'error', text: 'State not found.' });
                }
            } catch (error) {
                console.error("Error fetching state:", error);
                setMessage({ type: 'error', text: 'Failed to load state details.' });
            } finally {
                setLoading(false);
            }
        };

        fetchStateData();
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setImagePreview(URL.createObjectURL(file)); // Show new local preview
        }
    };

    const removeImage = () => {
        setCoverImage(null);
        setImagePreview(null);
    };

    const handleUpdateState = async (e) => {
        e.preventDefault();

        if (!name || !description) {
            setMessage({ type: 'error', text: 'Name and description are required.' });
            return;
        }

        setSaving(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);

        // Only append the coverImage if the admin actually selected a new file
        if (coverImage) {
            formData.append('coverImage', coverImage);
        }

        try {
            const response = await axios.put(`${serverUrl}/api/admin/state/${id}`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMessage({ type: 'success', text: response.data.message || 'State updated successfully!' });

            // Redirect back to home after a brief delay so they see the success message
            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'An error occurred while updating the state.'
            });
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
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mx-auto mt-8">
                <div className="bg-amber-500 py-6 px-8 flex items-center gap-3">
                    <LuMap className="text-white" size={28} />
                    <h2 className="text-2xl font-bold text-white tracking-wide">Edit State</h2>
                </div>

                <form onSubmit={handleUpdateState} className="p-8 space-y-6">
                    {message.text && (
                        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                            {message.text}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">State Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <LuMap size={18} />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-amber-500 bg-gray-50 focus:bg-white"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image (Optional)</label>
                        {!imagePreview ? (
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-amber-500 bg-gray-50 cursor-pointer">
                                <div className="space-y-1 text-center">
                                    <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 px-1">
                                            <span>Upload a new file</span>
                                            <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative mt-2 rounded-xl overflow-hidden shadow-sm border border-gray-200 group">
                                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <label className="bg-white text-gray-900 p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer font-medium px-4">
                                        Change Image
                                        <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                                    </label>
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
                                rows={4}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-amber-500 bg-gray-50 focus:bg-white resize-y"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={saving} className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-sm text-base font-bold text-white bg-amber-500 hover:bg-amber-600 transition-colors mt-4">
                        {saving ? <ClipLoader color="#ffffff" size={24} /> : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditState;