"use client";

import { Globe, Wifi, WifiOff, Bell, ChevronDown, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const [openUser, setOpenUser] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [online, setOnline] = useState(true); // WIFI STATUS TOGGLE

  const userRef = useRef(null);
  const locationRef = useRef(null);

  // CLICK OUTSIDE HANDLER
  useEffect(() => {
    function handleClickOutside(e) {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setOpenUser(false);
      }
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setOpenLocation(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-white shadow-sm h-16 px-6 flex items-center justify-between sticky top-0 z-40">

      {/* LEFT SIDE — LOCATION + ONLINE STATUS */}
      <div className="flex items-center gap-6">

        {/* LOCATION DROPDOWN */}
        <div className="relative" ref={locationRef}>
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setOpenLocation((p) => !p)}
          >
            <MapPin className="text-blue-600" />
            <div>
              <div className="font-semibold text-sm">Lagos Main Branch</div>
              <div className="text-xs text-gray-500">LG-MAIN</div>
            </div>
            <ChevronDown />
          </div>

          {/* LOCATION DROPDOWN CONTENT */}
          {openLocation && (
            <div className="absolute mt-3 bg-white shadow-lg rounded-xl w-72 border border-gray-200 z-50">
              <div className="p-4 font-semibold border-b">Select Location</div>

              <div className="p-4 cursor-pointer hover:bg-gray-100 bg-blue-50">
                <div className="font-semibold text-sm">Lagos Main Branch</div>
                <div className="text-xs text-gray-500">LG-MAIN</div>
              </div>

              <div className="p-4 cursor-pointer hover:bg-gray-100">
                <div className="font-semibold text-sm">Abuja Office</div>
                <div className="text-xs text-gray-500">ABJ-01</div>
              </div>

              <div className="p-4 cursor-pointer hover:bg-gray-100 rounded-b-xl">
                <div className="font-semibold text-sm">Port Harcourt</div>
                <div className="text-xs text-gray-500">PH-01</div>
              </div>
            </div>
          )}
        </div>

        {/* ONLINE / OFFLINE STATUS TAG */}
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1
            ${online ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}
        >
          {online ? "Online" : "Offline"}
        </span>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">

        {/* GLOBE */}
        <Globe />

        {/* WIFI TOGGLE BUTTON */}
        <div
          className="cursor-pointer"
          onClick={() => setOnline((prev) => !prev)}
        >
          {online ? <Wifi className="text-green-600" /> : <WifiOff className="text-red-600" />}
        </div>

        {/* NOTIFICATION BELL */}
        <div className="relative cursor-pointer">
          <Bell />
          <span className="absolute top-0 right-0 bg-red-500 w-2 h-2 rounded-full"></span>
        </div>

        {/* USER DROPDOWN */}
        <div className="relative" ref={userRef}>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setOpenUser((prev) => !prev)}
          >
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
              A
            </div>
            <div className="text-sm">
              <div className="font-semibold">Adebayo Okonkwo</div>
              <div className="text-gray-500">Owner</div>
            </div>
            <ChevronDown />
          </div>

          {/* USER DROPDOWN CONTENT */}
          {openUser && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-72 border border-gray-200 text-sm">
              <div className="px-4 py-4 border-b border-gray-200">
                <div className="font-semibold text-gray-900">Adebayo Okonkwo</div>
                <div className="text-gray-500 text-xs mt-0.5">adebayo@example.com</div>

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-gray-600 font-medium">Role:</span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium border">
                    Owner
                  </span>
                </div>
              </div>

              <div className="p-3 hover:bg-gray-100 cursor-pointer">Profile Settings</div>
              <div className="p-3 hover:bg-gray-100 cursor-pointer">Switch Role (Demo)</div>
              <div className="p-3 hover:bg-gray-100 cursor-pointer text-red-600 font-medium">
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
