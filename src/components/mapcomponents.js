"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// Custom icons
const availableIcon = new L.Icon({
  iconUrl: "/icons/available.png",
  iconSize: [30, 40],
});

const fullIcon = new L.Icon({
  iconUrl: "/icons/full.png",
  iconSize: [30, 40],
});

// Component to update map center
const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, 13);
  return null;
};

const MapComponent = () => {
  const [position, setPosition] = useState([37.7749, -122.4194]); // Default location (San Francisco)
  const [searchQuery, setSearchQuery] = useState("");
  const [newSpotName, setNewSpotName] = useState("");
  const [parkingSpots, setParkingSpots] = useState([]);

  // Load saved parking spots from localStorage
  useEffect(() => {
    const savedSpots = JSON.parse(localStorage.getItem("parkingSpots")) || [
      { id: 1, name: "Spot A", lat: 37.775, lon: -122.419, available: true },
      { id: 2, name: "Spot B", lat: 37.776, lon: -122.418, available: false },
    ];
    setParkingSpots(savedSpots);
  }, []);

  // Save to localStorage whenever parking spots change
  useEffect(() => {
    localStorage.setItem("parkingSpots", JSON.stringify(parkingSpots));
  }, [parkingSpots]);

  // Search for a location
  const searchLocation = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
      } else {
        alert("Location not found!");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  // Toggle parking spot availability
  const toggleAvailability = (id) => {
    setParkingSpots((prevSpots) =>
      prevSpots.map((spot) =>
        spot.id === id ? { ...spot, available: !spot.available } : spot
      )
    );
  };

  // Add new parking spot
  const addParkingSpot = (e) => {
    e.preventDefault();
    if (!newSpotName) return alert("Please enter a spot name!");

    const newSpot = {
      id: Date.now(),
      name: newSpotName,
      lat: position[0],
      lon: position[1],
      available: true,
    };

    setParkingSpots([...parkingSpots, newSpot]);
    setNewSpotName("");
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />
        <button
          onClick={searchLocation}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Add New Parking Spot */}
      <form onSubmit={addParkingSpot} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="New spot name..."
          value={newSpotName}
          onChange={(e) => setNewSpotName(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Spot
        </button>
      </form>

      {/* Map */}
      <MapContainer center={position} zoom={13} style={{ height: "400px", width: "100%" }}>
        <ChangeView center={position} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Parking Spots */}
        {parkingSpots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.lat, spot.lon]}
            icon={spot.available ? availableIcon : fullIcon}
          >
            <Popup>
              {spot.name} - {spot.available ? "Available" : "Full"} <br />
              <button
                onClick={() => toggleAvailability(spot.id)}
                className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
              >
                Mark as {spot.available ? "Full" : "Available"}
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
