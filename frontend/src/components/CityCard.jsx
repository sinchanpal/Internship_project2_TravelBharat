import React from 'react';
import { Link } from 'react-router-dom';
import { LuMapPin } from "react-icons/lu";

const CityCard = ({ city }) => {
    const fallbackImage = "https://images.unsplash.com/photo-1514222134-b57fbb8ce0ee?q=80&w=1200&auto=format&fit=crop";

    return (
        // Assuming your city model also auto-generates a slug, otherwise use city._id
        <Link
            to={`/city/${city._id}`}
            className="group relative h-72 w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block bg-gray-100"
        >
            <img
                src={city?.coverImage || fallbackImage}
                alt={`${city?.name}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                onError={(e) => { e.target.src = fallbackImage }}
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>

            <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center gap-2 text-green-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                    <LuMapPin size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Explore City</span>
                </div>
                <h3 className="text-white text-2xl font-bold tracking-wide drop-shadow-md">
                    {city?.name}
                </h3>
                <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                    {city?.description}
                </p>
            </div>
        </Link>
    );
};

export default CityCard;