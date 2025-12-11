"use client";

import { useEffect, useState } from "react";
import { Check, X, ChevronDown } from "lucide-react";

export default function RBACSettings() {
  const [data, setData] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    fetch("/api/beapOnelite/settings")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setSelectedRole(json.currentRole);
      });
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  // Extract clean tag name ("Owner" from "Owner (Full Access)")
  const tagLabel = selectedRole.includes("(")
    ? selectedRole.split("(")[0].trim()
    : selectedRole;

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Page Title */}
      <h1 className="text-2xl font-semibold">Role-Based Access Control (RBAC)</h1>
      <p className="text-gray-600 mt-1">Manage user roles and permissions</p>

      {/* ---- CURRENT ROLE CARD ---- */}
      <div className="mt-6 relative p-5 rounded-lg border bg-gradient-to-r from-purple-50 to-indigo-50">

        {/* Top-right tag (dynamic) */}
        <div className="absolute top-3 right-3 bg-black text-white text-xs px-3 py-1 rounded-full">
          {tagLabel}
        </div>

        {/* Title */}
        <p className="text-gray-700 font-medium">Your Current Role</p>

        {/* Description */}
        <p className="text-gray-500 text-sm mt-1">
          Switch roles to test different permission levels (Demo Mode)
        </p>

        {/* Dropdown input */}
        <button
          onClick={() => setOpenDropdown(!openDropdown)}
          className="mt-4 w-full flex justify-between items-center p-3 bg-gray-100 rounded-md"
        >
          <span>{selectedRole}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {/* Role dropdown */}
        {openDropdown && (
          <div className="mt-2 border rounded-md bg-white shadow-sm z-10 relative">
            {data.roles.map((role, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedRole(role);
                  setOpenDropdown(false);
                }}
                className="p-3 hover:bg-gray-100 cursor-pointer"
              >
                {role}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---- PERMISSION MATRIX ---- */}
      <h2 className="mt-10 text-lg font-semibold">Permission Matrix</h2>

      <div className="mt-4 border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          {/* Table Header */}
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Feature</th>
              {data.roles.map((role, i) => (
                <th key={i} className="p-3 text-left">{role}</th>
              ))}
            </tr>
          </thead>

          {/* Table body */}
          <tbody>
            {data.permissions.map((row, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-3">{row.feature}</td>

                {data.roles.map((role, rIdx) => (
                  <td key={rIdx} className="p-3">
                    {row[role] === true ? (
                      <Check className="text-green-600 w-5 h-5" />
                    ) : row[role] === false ? (
                      <X className="text-red-600 w-5 h-5" />
                    ) : (
                      <span className="text-gray-700">{row[role]}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---- MULTI USER ADD ON ---- */}
      <div className="mt-8 p-4 rounded-lg bg-purple-50 border border-purple-200 text-purple-700">
        <strong>Multi-User Add-On:</strong> {data.multiUserAddon.description}
      </div>
    </div>
  );
}
