import React, { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { LuMap, LuImage, LuAlignLeft, LuX } from "react-icons/lu";
import { FaCloudUploadAlt } from "react-icons/fa";
import { serverUrl } from '../../App';

const AddState = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // coverImage now stores the actual File object, not a string
    const [coverImage, setCoverImage] = useState(null);
    // imagePreview stores the local temporary URL for the UI
    const [imagePreview, setImagePreview] = useState(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Handle file selection and generate a preview URL
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setImagePreview(URL.createObjectURL(file)); // Creates a fast local preview
        }
    };

    // Remove the selected image
    const removeImage = () => {
        setCoverImage(null);
        setImagePreview(null);
    };

    const handleAddState = async (e) => {
        e.preventDefault();

        if (!name || !description || !coverImage) {
            setMessage({ type: 'error', text: 'Please fill in all fields and select an image.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        // IMPORTANT: Because we are sending a file, we MUST use FormData
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('coverImage', coverImage); // Appends the actual File object

        try {
            const response = await axios.post(`${serverUrl}/api/admin/state`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data' // Tells Express to use Multer
                }
            });

            setMessage({ type: 'success', text: response.data.message || 'State added successfully!' });

            // Clear the form on success
            setName('');
            setDescription('');
            removeImage(); // Clears both the file state and the preview

        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'An error occurred while adding the state.'
            });
            console.error("Error adding state:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 rounded-2xl">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

                {/* Header */}
                <div className="bg-gray-900 py-6 px-8 flex items-center gap-3">
                    <LuMap className="text-green-400" size={28} />
                    <h2 className="text-2xl font-bold text-white tracking-wide">Add New State</h2>
                </div>

                {/* Form */}
                <form onSubmit={handleAddState} className="p-8 space-y-6">

                    {/* Status Message */}
                    {message.text && (
                        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* State Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">State Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <LuMap size={18} />
                            </div>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                placeholder="e.g. West Bengal"
                                required
                            />
                        </div>
                    </div>

                    {/* Image Upload & Preview Section */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>

                        {!imagePreview ? (
                            // Upload Box (Shows when no image is selected)
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 transition-colors bg-gray-50 cursor-pointer">
                                <div className="space-y-1 text-center">
                                    <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500 px-1">
                                            <span>Upload a file</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                accept="image/*"
                                                className="sr-only"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                                </div>
                            </div>
                        ) : (
                            // Image Preview Box (Shows when image is selected)
                            <div className="relative mt-2 rounded-xl overflow-hidden shadow-sm border border-gray-200 group">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover"
                                />
                                {/* Dark overlay that appears on hover */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors flex items-center gap-2 font-medium px-4"
                                    >
                                        <LuX size={20} /> Remove Image
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                                <LuAlignLeft size={18} />
                            </div>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white resize-y"
                                placeholder="A brief description of the state..."
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? <ClipLoader color="#ffffff" size={24} /> : "Upload to Cloudinary & Save"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddState;