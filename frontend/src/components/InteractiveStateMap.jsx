import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { serverUrl } from '../App';
import { LuMapPin } from 'react-icons/lu';
import indiaGeoJson from '../data/india_state_geo.json';

const InteractiveStateMap = ({ onSelectState }) => {
    const [activeStates, setActiveStates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/explore/get-all-states`, {
                    withCredentials: true
                });
                if (response.data.success) {
                    // Create an array of just the slugs we have in our database (e.g., ['west-bengal', 'sikkim'])
                    const slugs = response.data.states.map(s => s.slug);
                    setActiveStates(slugs);
                }
            } catch (error) {
                console.error("Error loading map state data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStates();
    }, []);

    // India center coordinates
    const indiaCenter = [22.5937, 78.9629];

    // 2. HELPER TO EXTRACT SLUG FROM GEOJSON
    // GeoJSON files name their properties differently. We check the most common keys.
    const getStateSlug = (feature) => {
        const stateName = feature.properties.NAME_1 || feature.properties.st_nm || feature.properties.name || "";
        return stateName.toLowerCase().replace(/\s+/g, '-');
    };

    // 3. STYLE FUNCTION (Default colors)
    const mapStyle = (feature) => {
        const slug = getStateSlug(feature);
        const isActive = activeStates.includes(slug); // Check if this state is in our DB

        return {
            fillColor: isActive ? '#16a34a' : '#e5e7eb', // Green if we have places, Gray if empty
            weight: 1, // Border thickness
            opacity: 1,
            color: 'white', // Border color
            fillOpacity: isActive ? 0.6 : 0.4
        };
    };

    // 4. INTERACTIVITY FUNCTION (Hover & Click)
    const onEachState = (feature, layer) => {
        const slug = getStateSlug(feature);
        const isActive = activeStates.includes(slug);
        const stateName = feature.properties.NAME_1 || feature.properties.st_nm || feature.properties.name;

        // Add a tooltip showing the state name on hover
        if (stateName) {
            layer.bindTooltip(stateName, {
                sticky: true,
                className: 'font-bold text-gray-900 bg-white px-2 py-1 rounded shadow-sm border-0'
            });
        }

        layer.on({
            mouseover: (e) => {
                const targetLayer = e.target;
                if (isActive) {
                    // Darken the green on hover
                    targetLayer.setStyle({
                        fillOpacity: 0.9,
                        weight: 2,
                        color: '#15803d'
                    });
                } else {
                    // Slight darken for inactive states
                    targetLayer.setStyle({
                        fillOpacity: 0.6
                    });
                }
            },
            mouseout: (e) => {
                const targetLayer = e.target;
                targetLayer.setStyle(mapStyle(feature)); // Reset to default style
            },
            click: () => {
                if (isActive && onSelectState) {
                    onSelectState(slug); // Navigate to state details!
                }
            }
        });
    };

    if (loading) {
        return (
            <div className="w-full h-96 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-400 font-medium border border-gray-200">
                Loading Interactive Map...
            </div>
        );
    }

    return (
        <div className="w-full bg-white p-4 rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="mb-4 flex items-center justify-between px-2">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <LuMapPin className="text-green-600" /> Explore by Region
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Hover and click on any highlighted state to discover its destinations.
                    </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-600 opacity-60"></span> Destinations Available</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-200"></span> Coming Soon</span>
                </div>
            </div>

            <div className="w-full h-170 rounded-2xl overflow-hidden shadow-inner border border-gray-100 z-0 relative bg-[#e0f3ff]">
                <MapContainer
                    center={indiaCenter}
                    zoom={4.5}
                    scrollWheelZoom={false}
                    className="w-full h-full z-0"
                >
                    {/* We removed the TileLayer so the background is clean and focuses strictly on the boundaries! */}

                    <GeoJSON
                        data={indiaGeoJson}
                        style={mapStyle}
                        onEachFeature={onEachState}
                    />
                </MapContainer>
            </div>
        </div>
    );
};

export default InteractiveStateMap;