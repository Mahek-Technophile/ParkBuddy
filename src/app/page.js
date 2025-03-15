"use client";

import dynamic from "next/dynamic";

// Dynamically import MapComponent to disable SSR
const MapComponent = dynamic(() => import("@/components/mapcomponents"), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Header */}
      <header className="w-full bg-blue-600 text-white py-4 text-center text-2xl font-bold">
        Parking Spot Finder 🚗
      </header>

      {/* Search Bar */}
      <div className="mt-6 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter location..."
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Find Parking
        </button>
      </div>

      {/* Map Component */}
      <div className="mt-6 w-full max-w-4xl h-96 bg-gray-300 flex items-center justify-center">
        <MapComponent />
      </div>
    </div>
  );
}
